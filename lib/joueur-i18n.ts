import type { LocaleCode } from "@/lib/locales";

type JoueurTranslations = {
  pageTitle: string;
  welcome: string;
  description: string;
  heroTitleShort: string;
  heroTitleLong: string;
  heroParagraph: string;
  challengeLine: string;
  ctaStart: string;
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
    heroTitleShort: "1000 Questions Bibliques pour Moi",
    heroTitleLong: "Bienvenue sur 1000 Questions Bibliques pour Moi",
    heroParagraph:
      "Plongez au cœur de la Bible à travers un défi unique, conçu pour tester vos connaissances, éveiller votre curiosité et approfondir votre foi. Que vous soyez débutant ou connaisseur, chaque question est une occasion de (re)découvrir les histoires, les personnages et les enseignements qui ont marqué l'Histoire. Seul, en famille ou entre amis, relevez le défi et voyez jusqu'où vos réponses vous mèneront.",
    challengeLine:
      "Êtes-vous prêt à mettre votre savoir biblique à l'épreuve ?",
    ctaStart: "Commençons",
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
    heroTitleShort: "1000 Bible Questions for Me",
    heroTitleLong: "Welcome to 1000 Bible Questions for Me",
    heroParagraph:
      "Dive into the heart of the Bible through a unique challenge, designed to test your knowledge, spark your curiosity, and deepen your faith. Whether you're a beginner or an expert, each question is an opportunity to (re)discover the stories, characters, and teachings that have shaped History. Alone, with family, or among friends, take on the challenge and see how far your answers will take you.",
    challengeLine: "Are you ready to put your biblical knowledge to the test?",
    ctaStart: "Let's Begin",
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
    heroTitleShort: "1000 Preguntas Bíblicas para Mí",
    heroTitleLong: "Bienvenido a 1000 Preguntas Bíblicas para Mí",
    heroParagraph:
      "Sumérgete en el corazón de la Biblia a través de un desafío único, diseñado para poner a prueba tus conocimientos, despertar tu curiosidad y profundizar tu fe. Ya seas principiante o experto, cada pregunta es una oportunidad para (re)descubrir las historias, los personajes y las enseñanzas que han marcado la Historia. Solo, en familia o entre amigos, acepta el desafío y ve hasta dónde te llevarán tus respuestas.",
    challengeLine:
      "¿Estás listo para poner a prueba tus conocimientos bíblicos?",
    ctaStart: "Comencemos",
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
    heroTitleShort: "1000 Bibelfragen für Mich",
    heroTitleLong: "Willkommen bei 1000 Bibelfragen für Mich",
    heroParagraph:
      "Tauchen Sie ein in das Herz der Bibel durch eine einzigartige Herausforderung, die Ihr Wissen testet, Ihre Neugier weckt und Ihren Glauben vertieft. Ob Anfänger oder Kenner, jede Frage ist eine Gelegenheit, die Geschichten, Charaktere und Lehren, die die Geschichte geprägt haben, (wieder) zu entdecken. Allein, mit der Familie oder unter Freunden, nehmen Sie die Herausforderung an und sehen Sie, wie weit Ihre Antworten Sie bringen.",
    challengeLine:
      "Sind Sie bereit, Ihr biblisches Wissen auf die Probe zu stellen?",
    ctaStart: "Lass uns anfangen",
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
    heroTitleShort: "1000 Perguntas Bíblicas para Mim",
    heroTitleLong: "Bem-vindo a 1000 Perguntas Bíblicas para Mim",
    heroParagraph:
      "Mergulhe no coração da Bíblia através de um desafio único, projetado para testar seus conhecimentos, despertar sua curiosidade e aprofundar sua fé. Seja você iniciante ou conhecedor, cada pergunta é uma oportunidade de (re)descobrir as histórias, os personagens e os ensinamentos que marcaram a História. Sozinho, em família ou entre amigos, aceite o desafio e veja até onde suas respostas o levarão.",
    challengeLine:
      "Você está pronto para colocar seu conhecimento bíblico à prova?",
    ctaStart: "Vamos começar",
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
