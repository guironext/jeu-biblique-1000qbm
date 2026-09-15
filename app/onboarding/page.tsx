import { redirect } from "next/navigation";
import { OnboardingForm } from "@/app/ui/onboarding-form";
import { afterLoginPath } from "@/lib/auth-paths";
import { getPublishedLocales, localeLabel } from "@/lib/catalog";
import { getProfile, requireUser } from "@/lib/dal";

export default async function OnboardingPage() {
  const { user } = await requireUser();
  const profile = await getProfile(user.id);

  if (profile) {
    redirect(afterLoginPath(user.role, true));
  }

  const locales = (await getPublishedLocales()).map((code) => ({
    code,
    name: localeLabel(code),
  }));

  return <OnboardingForm locales={locales} />;
}
