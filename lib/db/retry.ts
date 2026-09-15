function isRetryableDbError(error: unknown) {
  const parts: string[] = [];
  let current: unknown = error;

  for (let depth = 0; depth < 5 && current; depth += 1) {
    if (current instanceof Error) {
      parts.push(current.message, current.name);
      current =
        "cause" in current
          ? current.cause
          : "sourceError" in current
            ? (current as { sourceError?: unknown }).sourceError
            : undefined;
    } else {
      parts.push(String(current));
      break;
    }
  }

  return /fetch failed|Error connecting|ECONNRESET|ETIMEDOUT|UND_ERR|socket/i.test(
    parts.join(" "),
  );
}

export async function withDbRetry<T>(run: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await run();
    } catch (error) {
      lastError = error;
      if (!isRetryableDbError(error) || attempt === 2) {
        throw error;
      }
      await new Promise((resolve) => {
        setTimeout(resolve, 350 * (attempt + 1));
      });
    }
  }

  throw lastError;
}
