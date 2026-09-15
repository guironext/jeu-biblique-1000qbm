import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sections, stages } from "@/lib/db/schema";

const catalog = [
  {
    slug: "stage-1",
    title: "Stage 1 — Les fondements",
    description:
      "Les récits de la création, de la promesse et des premiers pas de la foi.",
    orderIndex: 1,
    sections: [
      "Section 1 — La création",
      "Section 2 — La chute et la promesse",
      "Section 3 — Noé et l'alliance",
      "Section 4 — Abraham",
      "Section 5 — Isaac et Jacob",
    ],
  },
  {
    slug: "stage-2",
    title: "Stage 2 — La sortie d'Égypte",
    description:
      "Moïse, la Pâque, le désert et la loi. Débloqué après le Stage 1.",
    orderIndex: 2,
    sections: [
      "Section 1 — Moïse",
      "Section 2 — Les plaies",
      "Section 3 — La mer Rouge",
      "Section 4 — Le Sinaï",
      "Section 5 — Le tabernacle",
    ],
  },
];

async function seed() {
  await db.delete(stages).where(eq(stages.locale, "en"));

  for (const stage of catalog) {
    const existing = await db.query.stages.findFirst({
      where: and(eq(stages.locale, "fr"), eq(stages.slug, stage.slug)),
    });

    const stageId =
      existing?.id ??
      (
        await db
          .insert(stages)
          .values({
            locale: "fr",
            slug: stage.slug,
            title: stage.title,
            description: stage.description,
            orderIndex: stage.orderIndex,
            published: true,
          })
          .returning({ id: stages.id })
      )[0].id;

    const existingSections = await db.query.sections.findMany({
      where: eq(sections.stageId, stageId),
    });

    if (existingSections.length === 0) {
      await db.insert(sections).values(
        stage.sections.map((title, index) => ({
          stageId,
          title,
          orderIndex: index + 1,
          published: true,
        })),
      );
    }
  }

  console.log("Catalog seeded: French stages only (no auto-translated copies).");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
