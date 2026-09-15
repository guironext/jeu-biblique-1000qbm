"use client";

export function DeleteButton({
  action,
  label,
  className,
}: {
  action: (formData: FormData) => void | Promise<void>;
  label: string;
  className?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm("Supprimer définitivement ? Cette action est irréversible.")) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className={
          className ??
          "text-sm font-medium text-red-700 underline-offset-4 hover:underline"
        }
      >
        {label}
      </button>
    </form>
  );
}
