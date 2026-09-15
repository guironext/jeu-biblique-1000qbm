import { HomeHero } from "@/app/ui/home-hero";
import { getCurrentSession } from "@/lib/dal";
import { Source_Serif_4 } from "next/font/google";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default async function Home() {
  const session = await getCurrentSession();
  const href = !session?.userId
    ? "/register"
    : session.role === "ADMIN"
      ? "/admin"
      : session.onboarded
        ? "/stages"
        : "/onboarding";

  return (
    <HomeHero
      href={href}
      signedIn={Boolean(session?.userId)}
      headingClassName={sourceSerif.className}
    />
  );
}
