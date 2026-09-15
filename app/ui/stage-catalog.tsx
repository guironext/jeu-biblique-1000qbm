"use client";

import { motion } from "framer-motion";
import {
  MotionLink,
  fadeUp,
  hoverLift,
  stagger,
  tap,
} from "@/app/ui/page-motion";

export type StageCardItem = {
  id: string;
  title: string;
  description: string;
  status: "LOCKED" | "UNLOCKED" | "COMPLETED";
  isNext: boolean;
  imageUrl?: string | null;
};

export function StageCatalog({
  stages,
  headingClassName,
  localeName,
}: {
  stages: StageCardItem[];
  headingClassName: string;
  localeName: string;
}) {
  return (
    <motion.main
      className="mx-auto w-full max-w-3xl flex-1 px-4 py-10"
      initial="hidden"
      animate="show"
      variants={stagger}
    >
      <motion.p
        variants={fadeUp}
        className="text-sm font-medium tracking-[0.18em] text-olive-800 uppercase"
      >
        Accueil des stages
      </motion.p>
      <motion.h1
        variants={fadeUp}
        className={`${headingClassName} mt-3 text-3xl font-semibold tracking-tight text-stone-900`}
      >
        Le jeu, en quelques règles
      </motion.h1>
      <motion.div
        variants={fadeUp}
        className="mt-6 space-y-4 text-base leading-7 text-stone-700"
      >
        <p>
          1000 QBM+ est un parcours de questions à choix unique. Chaque stage
          contient au moins cinq sections. Chaque section est un jeu de 40
          questions, avec une seule bonne réponse.
        </p>
        <p>
          Une bonne réponse vaut 1 point. Il faut au moins 80 % (32/40) pour
          débloquer la section suivante. Les stages s&apos;ouvrent dans
          l&apos;ordre : seul le Stage 1 est actif pour un nouveau joueur.
          Vous ne voyez que les stages chargés en {localeName} ; les autres
          langues restent invisibles.
        </p>
      </motion.div>

      {stages.length === 0 ? (
        <motion.p
          variants={fadeUp}
          className="mt-10 rounded-xl border border-stone-200 bg-white p-5 text-sm leading-6 text-stone-600"
        >
          Aucun stage n&apos;a encore été chargé dans votre langue (
          {localeName}). L&apos;administrateur doit publier un parcours dans
          cette langue pour que vous puissiez jouer.
        </motion.p>
      ) : (
        <motion.ol className="mt-10 flex flex-col gap-4" variants={stagger}>
          {stages.map((stage) => {
            const playable =
              stage.status === "UNLOCKED" || stage.status === "COMPLETED";

            return (
              <motion.li
                key={stage.id}
                variants={fadeUp}
                whileHover={playable ? hoverLift : undefined}
                className={`overflow-hidden rounded-xl border ${
                  playable
                    ? "border-olive-200 bg-white"
                    : "border-stone-200 bg-stone-100"
                }`}
              >
                {stage.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={stage.imageUrl}
                    alt=""
                    className="h-40 w-full object-cover sm:h-44"
                  />
                ) : null}
                <div className="p-5">
                <p className="text-xs font-medium tracking-wide text-olive-800 uppercase">
                  {stage.status === "LOCKED"
                    ? "Verrouillé"
                    : stage.status === "COMPLETED"
                      ? "Terminé"
                      : "Actif"}
                </p>
                <h2
                  className={`${headingClassName} mt-1 text-xl font-semibold text-stone-900`}
                >
                  {stage.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {stage.description}
                </p>
                {stage.isNext ? (
                  <MotionLink
                    href={`/stages/${stage.id}`}
                    whileHover={hoverLift}
                    whileTap={tap}
                    className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-olive-800 px-5 text-sm font-semibold text-white hover:bg-olive-900"
                  >
                    Commencez
                  </MotionLink>
                ) : playable ? (
                  <MotionLink
                    href={`/stages/${stage.id}`}
                    whileHover={hoverLift}
                    whileTap={tap}
                    className="mt-5 inline-flex h-11 items-center justify-center rounded-lg border border-olive-800 px-5 text-sm font-semibold text-olive-900 hover:bg-olive-50"
                  >
                    Revoir
                  </MotionLink>
                ) : (
                  <p className="mt-5 text-sm text-stone-500">
                    Gagnez le stage précédent pour débloquer celui-ci.
                  </p>
                )}
                </div>
              </motion.li>
            );
          })}
        </motion.ol>
      )}
    </motion.main>
  );
}
