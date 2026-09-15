// One-off publisher that works without Apple's git toolchain.
// Usage: node scripts/push-to-github.mjs [repo-url]

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import git from "isomorphic-git";
import http from "isomorphic-git/http/node";

const args = process.argv.slice(2);
const prepareOnly = args.includes("--prepare");
const dir = process.cwd();
const url =
  args.find((arg) => !arg.startsWith("--")) ??
  "https://github.com/guironext/1000QBM-.git";
const branch = "main";
const author = {
  name: process.env.GIT_AUTHOR_NAME ?? "guironext",
  email: process.env.GIT_AUTHOR_EMAIL ?? "guironext@users.noreply.github.com",
};

// Reads a secret without echoing it, so the token never lands in shell history.
function promptHidden(question) {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin;

    if (!stdin.isTTY) {
      reject(new Error("Lancez ce script dans un vrai terminal (TTY)."));
      return;
    }

    process.stdout.write(question);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    let value = "";

    const finish = (result, error) => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener("data", onData);
      process.stdout.write("\n");
      if (error) reject(error);
      else resolve(result);
    };

    const onData = (chunk) => {
      for (const char of chunk) {
        if (char === "\r" || char === "\n" || char === "\u0004") {
          finish(value.trim());
          return;
        }
        if (char === "\u0003") {
          finish(null, new Error("Annulé."));
          return;
        }
        if (char === "\u007f" || char === "\b") {
          value = value.slice(0, -1);
          continue;
        }
        value += char;
      }
    };

    stdin.on("data", onData);
  });
}

async function collectFiles(relative = "") {
  const entries = await fs.promises.readdir(path.join(dir, relative), {
    withFileTypes: true,
  });
  const files = [];

  for (const entry of entries) {
    if (entry.name === ".git") continue;

    const filepath = relative ? `${relative}/${entry.name}` : entry.name;

    if (await git.isIgnored({ fs, dir, filepath })) continue;

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(filepath)));
    } else if (entry.isFile()) {
      files.push(filepath);
    }
  }

  return files;
}

// Asks GitHub directly what the token can do, instead of guessing from a 403.
async function checkToken() {
  const token = await promptHidden("Token GitHub (saisie masquée) : ");
  const slug = url
    .replace(/^https:\/\/github\.com\//, "")
    .replace(/\.git$/, "");
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "1000qbm-plus",
  };

  const me = await fetch("https://api.github.com/user", { headers });
  if (me.ok) {
    console.log(`Compte reconnu : ${(await me.json()).login}`);
  } else {
    console.log(`/user → ${me.status} ${(await me.text()).slice(0, 200)}`);
  }

  const repo = await fetch(`https://api.github.com/repos/${slug}`, { headers });
  if (repo.ok) {
    const data = await repo.json();
    console.log(`Dépôt visible : ${data.full_name}`);
    console.log(
      data.permissions?.push
        ? "Écriture autorisée : le push devrait passer."
        : "Écriture refusée : le token n'a pas Contents = Read and write.",
    );
  } else {
    console.log(`/repos/${slug} → ${repo.status}`);
    console.log((await repo.text()).slice(0, 300));
    console.log(
      "Dépôt invisible pour ce token : Repository access ne l'inclut pas.",
    );
  }
}

async function main() {
  if (!fs.existsSync(path.join(dir, "package.json"))) {
    throw new Error("Lancez ce script depuis la racine du projet.");
  }

  if (args.includes("--check")) {
    await checkToken();
    return;
  }

  if (!fs.existsSync(path.join(dir, ".git"))) {
    await git.init({ fs, dir, defaultBranch: branch });
    console.log(`Dépôt initialisé sur la branche ${branch}.`);
  }

  console.log("Lecture des fichiers (.gitignore respecté)…");
  const files = await collectFiles();

  for (const filepath of files) {
    await git.add({ fs, dir, filepath });
  }
  console.log(`${files.length} fichiers ajoutés.`);

  let hasHead = true;
  try {
    await git.resolveRef({ fs, dir, ref: "HEAD" });
  } catch {
    hasHead = false;
  }

  const matrix = await git.statusMatrix({ fs, dir, filepaths: files });
  const dirty = matrix.some(([, head, workdir, stage]) => {
    return head !== 1 || workdir !== 1 || stage !== 1;
  });

  if (!hasHead || dirty) {
    const sha = await git.commit({
      fs,
      dir,
      author,
      message: "1000 QBM+ : catalogue, espace joueur et administration",
    });
    console.log(`Commit ${sha.slice(0, 7)} créé.`);
  } else {
    const sha = await git.resolveRef({ fs, dir, ref: "HEAD" });
    console.log(`Aucun changement : commit ${sha.slice(0, 7)} réutilisé.`);
  }

  await git.addRemote({ fs, dir, remote: "origin", url, force: true });

  if (prepareOnly) {
    console.log(`Remote origin → ${url}`);
    console.log("Prêt. Relancez sans --prepare pour publier.");
    return;
  }

  const token = await promptHidden("Token GitHub (saisie masquée) : ");
  if (!token) throw new Error("Token vide.");

  console.log(`Envoi vers ${url} …`);
  const result = await git.push({
    fs,
    http,
    dir,
    remote: "origin",
    ref: branch,
    // GitHub expects the token as the password, whatever the username.
    onAuth: () => ({ username: "x-access-token", password: token }),
  });

  if (result.ok) {
    console.log(`Terminé : branche ${branch} publiée.`);
  } else {
    throw new Error(result.error ?? "Push refusé par GitHub.");
  }
}

main().catch((error) => {
  console.error(`\nÉchec : ${error.message}`);

  const body = error?.data?.response;
  if (body) console.error(`Réponse GitHub : ${String(body).slice(0, 400)}`);

  const status = error?.data?.statusCode;
  if (status === 401) {
    console.error(
      "Token refusé : il est invalide, expiré, ou mal collé (espace en trop).",
    );
  }
  if (status === 403) {
    console.error(
      "Token valide mais sans droit d'écriture : vérifiez Repository access = 1000QBM- et Contents = Read and write.",
    );
  }

  process.exit(1);
});
