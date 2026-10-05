import type { LocaleCode } from "@/lib/locales";

type JoueurTranslations = {
  pageTitle: string;
  welcome: string;
  description: string;
  playStagesTitle: string;
  playStagesDescription: string;
  myAccountTitle: string;
  myAccountDescription: string;
  navHome: string;
  navStages: string;
  navAccount: string;
};

const translations: Record<LocaleCode, JoueurTranslations> = {
  fr: {
    pageTitle: "Espace Joueur",
    welcome: "Bienvenue, {name}",
    description:
      "Vous êtes connecté en tant que joueur. Commencez à jouer aux stages bibliques ou consultez vos informations de compte.",
    playStagesTitle: "Jouer aux stages",
    playStagesDescription:
      "Accédez à tous les stages bibliques disponibles en {locale}.",
    myAccountTitle: "Mon compte",
    myAccountDescription:
      "Consultez vos informations personnelles et les paramètres de votre compte.",
    navHome: "Accueil",
    navStages: "Stages",
    navAccount: "Mon compte",
  },
  en: {
    pageTitle: "Player Area",
    welcome: "Welcome, {name}",
    description:
      "You are logged in as a player. Start playing biblical stages or view your account information.",
    playStagesTitle: "Play Stages",
    playStagesDescription:
      "Access all biblical stages available in {locale}.",
    myAccountTitle: "My Account",
    myAccountDescription:
      "View your personal information and account settings.",
    navHome: "Home",
    navStages: "Stages",
    navAccount: "My Account",
  },
  es: {
    pageTitle: "Área de Jugador",
    welcome: "Bienvenido, {name}",
    description:
      "Está conectado como jugador. Comience a jugar las etapas bíblicas o consulte la información de su cuenta.",
    playStagesTitle: "Jugar Etapas",
    playStagesDescription:
      "Acceda a todas las etapas bíblicas disponibles en {locale}.",
    myAccountTitle: "Mi Cuenta",
    myAccountDescription:
      "Consulte su información personal y la configuración de su cuenta.",
    navHome: "Inicio",
    navStages: "Etapas",
    navAccount: "Mi Cuenta",
  },
  de: {
    pageTitle: "Spielerbereich",
    welcome: "Willkommen, {name}",
    description:
      "Sie sind als Spieler angemeldet. Beginnen Sie mit den biblischen Stufen oder sehen Sie Ihre Kontoinformationen ein.",
    playStagesTitle: "Stufen Spielen",
    playStagesDescription:
      "Greifen Sie auf alle biblischen Stufen zu, die in {locale} verfügbar sind.",
    myAccountTitle: "Mein Konto",
    myAccountDescription:
      "Sehen Sie Ihre persönlichen Informationen und Kontoeinstellungen ein.",
    navHome: "Startseite",
    navStages: "Stufen",
    navAccount: "Mein Konto",
  },
  pt: {
    pageTitle: "Área do Jogador",
    welcome: "Bem-vindo, {name}",
    description:
      "Você está conectado como jogador. Comece a jogar as etapas bíblicas ou consulte suas informações de conta.",
    playStagesTitle: "Jogar Etapas",
    playStagesDescription:
      "Acesse todas as etapas bíblicas disponíveis em {locale}.",
    myAccountTitle: "Minha Conta",
    myAccountDescription:
      "Consulte suas informações pessoais e configurações de conta.",
    navHome: "Início",
    navStages: "Etapas",
    navAccount: "Minha Conta",
  },
};

export function getJoueurTranslations(locale: string): JoueurTranslations {
  const localeCode = locale as LocaleCode;
  return translations[localeCode] ?? translations.fr;
}

export function translateJoueur(
  key: keyof JoueurTranslations,
  locale: string,
  replacements?: Record<string, string>,
): string {
  const t = getJoueurTranslations(locale);
  let text = t[key];

  if (replacements) {
    Object.entries(replacements).forEach(([placeholder, value]) => {
      text = text.replace(`{${placeholder}}`, value);
    });
  }

  return text;
}
