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
  stagesPageTitle: string;
  stagesPageSubtitle: string;
  stagesPageDescription1: string;
  stagesPageDescription2: string;
  noStagesMessage: string;
  statusLocked: string;
  statusUnlocked: string;
  statusCompleted: string;
  playButton: string;
  reviewButton: string;
  lockedMessage: string;
  progressLabel: string;
  quizQuestionProgress: string;
  quizSubmit: string;
  quizNext: string;
  quizSkip: string;
  quizCorrect: string;
  quizIncorrect: string;
  quizNoQuestions: string;
  successTitle: string;
  successMessage: string;
  successButton: string;
  successScore: string;
  failureTitle: string;
  failureMessage: string;
  failureButton: string;
  failureScore: string;
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
    stagesPageTitle: "Accueil des stages",
    stagesPageSubtitle: "Le jeu, en quelques règles",
    stagesPageDescription1:
      "1000 QBM+ est un parcours de questions à choix unique. Chaque stage contient au moins cinq sections. Chaque section est un jeu de 40 questions, avec une seule bonne réponse.",
    stagesPageDescription2:
      "Une bonne réponse vaut 1 point. Il faut au moins 80 % (32/40) pour valider une section et débloquer la suivante. Les stages s'ouvrent dans l'ordre : seul le premier stage est actif pour un nouveau joueur. Vous ne voyez que les stages chargés en {localeName} ; les autres langues restent invisibles.",
    noStagesMessage:
      "Aucun stage n'a encore été chargé dans votre langue ({localeName}). L'administrateur doit publier un parcours dans cette langue pour que vous puissiez jouer.",
    statusLocked: "Verrouillé",
    statusUnlocked: "Disponible",
    statusCompleted: "Terminé",
    playButton: "Jouer",
    reviewButton: "Revoir",
    lockedMessage: "Terminez le stage précédent pour débloquer celui-ci.",
    progressLabel: "Progression : {completed}/{total} sections",
    quizQuestionProgress: "Question {current}/{total}",
    quizSubmit: "Valider",
    quizNext: "Question suivante",
    quizSkip: "Suivant",
    quizCorrect: "Correct !",
    quizIncorrect: "Faux !",
    quizNoQuestions: "Cette section ne contient aucune question pour le moment.",
    successTitle: "Bravo !",
    successMessage: "Vous avez réussi cette section avec brio. Continuez comme ça !",
    successButton: "Félicitations Continue Ainsi",
    successScore: "Votre score : {score}/{total} ({percent}%)",
    failureTitle: "Pas encore cette fois",
    failureMessage: "Vous n'avez pas atteint le seuil de 80%. Essayez à nouveau !",
    failureButton: "Reprendre la Partie",
    failureScore: "Votre score : {score}/{total} ({percent}%)",
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
    stagesPageTitle: "Stages Home",
    stagesPageSubtitle: "The game, in a few rules",
    stagesPageDescription1:
      "1000 QBM+ is a single-choice question journey. Each stage contains at least five sections. Each section is a set of 40 questions, with one correct answer.",
    stagesPageDescription2:
      "A correct answer is worth 1 point. You need at least 80% (32/40) to validate a section and unlock the next one. Stages open in order: only the first stage is active for a new player. You only see stages loaded in {localeName}; other languages remain invisible.",
    noStagesMessage:
      "No stages have been loaded in your language ({localeName}) yet. The administrator must publish a course in this language for you to play.",
    statusLocked: "Locked",
    statusUnlocked: "Available",
    statusCompleted: "Completed",
    playButton: "Play",
    reviewButton: "Review",
    lockedMessage: "Complete the previous stage to unlock this one.",
    progressLabel: "Progress: {completed}/{total} sections",
    quizQuestionProgress: "Question {current}/{total}",
    quizSubmit: "Submit",
    quizNext: "Next question",
    quizSkip: "Next",
    quizCorrect: "Correct!",
    quizIncorrect: "Wrong!",
    quizNoQuestions: "This section has no questions at the moment.",
    successTitle: "Well done!",
    successMessage: "You passed this section with flying colors. Keep it up!",
    successButton: "Continue",
    successScore: "Your score: {score}/{total} ({percent}%)",
    failureTitle: "Not quite there",
    failureMessage: "You didn't reach the 80% threshold. Try again!",
    failureButton: "Try Again",
    failureScore: "Your score: {score}/{total} ({percent}%)",
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
    stagesPageTitle: "Inicio de etapas",
    stagesPageSubtitle: "El juego, en pocas reglas",
    stagesPageDescription1:
      "1000 QBM+ es un recorrido de preguntas de opción única. Cada etapa contiene al menos cinco secciones. Cada sección es un conjunto de 40 preguntas, con una sola respuesta correcta.",
    stagesPageDescription2:
      "Una respuesta correcta vale 1 punto. Necesitas al menos el 80% (32/40) para validar una sección y desbloquear la siguiente. Las etapas se abren en orden: solo la primera etapa está activa para un nuevo jugador. Solo ves las etapas cargadas en {localeName}; otros idiomas permanecen invisibles.",
    noStagesMessage:
      "Aún no se han cargado etapas en su idioma ({localeName}). El administrador debe publicar un curso en este idioma para que pueda jugar.",
    statusLocked: "Bloqueado",
    statusUnlocked: "Disponible",
    statusCompleted: "Completado",
    playButton: "Jugar",
    reviewButton: "Revisar",
    lockedMessage: "Complete la etapa anterior para desbloquear esta.",
    progressLabel: "Progreso: {completed}/{total} secciones",
    quizQuestionProgress: "Pregunta {current}/{total}",
    quizSubmit: "Enviar",
    quizNext: "Siguiente pregunta",
    quizSkip: "Siguiente",
    quizCorrect: "¡Correcto!",
    quizIncorrect: "¡Incorrecto!",
    quizNoQuestions: "Esta sección no tiene preguntas en este momento.",
    successTitle: "¡Muy bien!",
    successMessage: "Pasaste esta sección con gran éxito. ¡Sigue así!",
    successButton: "Continuar",
    successScore: "Tu puntuación: {score}/{total} ({percent}%)",
    failureTitle: "Aún no",
    failureMessage: "No alcanzaste el umbral del 80%. ¡Inténtalo de nuevo!",
    failureButton: "Intentar de nuevo",
    failureScore: "Tu puntuación: {score}/{total} ({percent}%)",
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
    stagesPageTitle: "Stufen-Startseite",
    stagesPageSubtitle: "Das Spiel, in wenigen Regeln",
    stagesPageDescription1:
      "1000 QBM+ ist eine Einzelwahl-Fragenreise. Jede Stufe enthält mindestens fünf Abschnitte. Jeder Abschnitt ist ein Satz von 40 Fragen mit einer richtigen Antwort.",
    stagesPageDescription2:
      "Eine richtige Antwort ist 1 Punkt wert. Sie benötigen mindestens 80% (32/40), um einen Abschnitt zu validieren und den nächsten freizuschalten. Stufen öffnen sich in der Reihenfolge: Nur die erste Stufe ist für einen neuen Spieler aktiv. Sie sehen nur Stufen, die in {localeName} geladen sind; andere Sprachen bleiben unsichtbar.",
    noStagesMessage:
      "Es wurden noch keine Stufen in Ihrer Sprache ({localeName}) geladen. Der Administrator muss einen Kurs in dieser Sprache veröffentlichen, damit Sie spielen können.",
    statusLocked: "Gesperrt",
    statusUnlocked: "Verfügbar",
    statusCompleted: "Abgeschlossen",
    playButton: "Spielen",
    reviewButton: "Überprüfen",
    lockedMessage: "Schließen Sie die vorherige Stufe ab, um diese freizuschalten.",
    progressLabel: "Fortschritt: {completed}/{total} Abschnitte",
    quizQuestionProgress: "Frage {current}/{total}",
    quizSubmit: "Absenden",
    quizNext: "Nächste Frage",
    quizSkip: "Weiter",
    quizCorrect: "Richtig!",
    quizIncorrect: "Falsch!",
    quizNoQuestions: "Dieser Abschnitt hat derzeit keine Fragen.",
    successTitle: "Gut gemacht!",
    successMessage: "Sie haben diesen Abschnitt mit Bravour bestanden. Weiter so!",
    successButton: "Weiter",
    successScore: "Ihre Punktzahl: {score}/{total} ({percent}%)",
    failureTitle: "Noch nicht ganz",
    failureMessage: "Sie haben die 80%-Schwelle nicht erreicht. Versuchen Sie es erneut!",
    failureButton: "Erneut versuchen",
    failureScore: "Ihre Punktzahl: {score}/{total} ({percent}%)",
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
    stagesPageTitle: "Início das etapas",
    stagesPageSubtitle: "O jogo, em poucas regras",
    stagesPageDescription1:
      "1000 QBM+ é uma jornada de perguntas de escolha única. Cada etapa contém pelo menos cinco seções. Cada seção é um conjunto de 40 perguntas, com uma única resposta correta.",
    stagesPageDescription2:
      "Uma resposta correta vale 1 ponto. Você precisa de pelo menos 80% (32/40) para validar uma seção e desbloquear a próxima. As etapas abrem em ordem: apenas a primeira etapa está ativa para um novo jogador. Você só vê etapas carregadas em {localeName}; outros idiomas permanecem invisíveis.",
    noStagesMessage:
      "Nenhuma etapa foi carregada em seu idioma ({localeName}) ainda. O administrador deve publicar um curso neste idioma para que você possa jogar.",
    statusLocked: "Bloqueado",
    statusUnlocked: "Disponível",
    statusCompleted: "Concluído",
    playButton: "Jogar",
    reviewButton: "Revisar",
    lockedMessage: "Complete a etapa anterior para desbloquear esta.",
    progressLabel: "Progresso: {completed}/{total} seções",
    quizQuestionProgress: "Pergunta {current}/{total}",
    quizSubmit: "Enviar",
    quizNext: "Próxima pergunta",
    quizSkip: "Próxima",
    quizCorrect: "Correto!",
    quizIncorrect: "Errado!",
    quizNoQuestions: "Esta seção não tem perguntas no momento.",
    successTitle: "Muito bem!",
    successMessage: "Você passou nesta seção com louvor. Continue assim!",
    successButton: "Continuar",
    successScore: "Sua pontuação: {score}/{total} ({percent}%)",
    failureTitle: "Ainda não",
    failureMessage: "Você não atingiu o limite de 80%. Tente novamente!",
    failureButton: "Tentar novamente",
    failureScore: "Sua pontuação: {score}/{total} ({percent}%)",
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
