"use client";

import Link from "next/link";
import { deleteUser } from "@/app/admin/users/actions";

function iconButtonClassName(tone: "neutral" | "danger") {
  return tone === "danger"
    ? "inline-flex size-10 items-center justify-center rounded-lg border border-red-200 bg-white text-red-700 transition-colors hover:bg-red-50"
    : "inline-flex size-10 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-700 transition-colors hover:bg-stone-50";
}

function EditIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-[18px]">
      <path
        d="M13.4 3.6a1.7 1.7 0 0 1 2.4 2.4L7.2 14.6 4 15.8l1.2-3.2 8.2-9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-[18px]">
      <path
        d="M4.5 6h11M8 6V4.75A1.25 1.25 0 0 1 9.25 3.5h1.5A1.25 1.25 0 0 1 12 4.75V6M6.25 6l.6 9.1A1.25 1.25 0 0 0 8.1 16.25h3.8a1.25 1.25 0 0 0 1.25-1.15L13.75 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UserRowActions({
  userId,
  canDelete,
}: {
  userId: string;
  canDelete: boolean;
}) {
  const removeUser = deleteUser.bind(null, userId);

  return (
    <div className="flex items-center gap-1.5">
      <Link
        href={`/admin/users/${userId}`}
        aria-label="Modifier cet utilisateur"
        title="Modifier"
        className={iconButtonClassName("neutral")}
      >
        <EditIcon />
      </Link>
      {canDelete ? (
        <form
          action={removeUser}
          onSubmit={(event) => {
            if (
              !window.confirm(
                "Supprimer définitivement ce compte et toute sa progression ? Cette action est irréversible.",
              )
            ) {
              event.preventDefault();
            }
          }}
        >
          <button
            type="submit"
            aria-label="Supprimer cet utilisateur"
            title="Supprimer"
            className={iconButtonClassName("danger")}
          >
            <TrashIcon />
          </button>
        </form>
      ) : null}
    </div>
  );
}