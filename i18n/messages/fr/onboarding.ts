export const onboarding = {
  reasons: {
    title: "Pourquoi voulez-vous arrêter la cigarette ?",
    subtitle: "Choisissez ce qui compte le plus. Vous pouvez en sélectionner plusieurs.",
    health: { label: "Une meilleure santé" },
    family: { label: "La famille et les proches" },
    money: { label: "Économiser de l'argent" },
    freedom: { label: "Briser l'habitude" },
    smell: { label: "Une haleine et des vêtements plus frais" },
    fitness: { label: "Plus d'énergie et de forme" },
    longevity: { label: "Vivre plus longtemps" },
    control: { label: "Reprendre le contrôle" },
    example: { label: "Montrer le bon exemple" },
    sleep: { label: "Mieux dormir" },
    appearance: { label: "Des dents et une peau plus saines" },
    calm: { label: "Se sentir plus calme au quotidien" },
  },
  motivation: {
    title: "À quel point êtes-vous prêt à arrêter la cigarette ?",
    subtitle:
      "Soyez honnête. Nous adapterons Quitify à là où vous en êtes maintenant.",
    high: { label: "Élevée" },
    medium: { label: "Moyenne" },
    low: { label: "Faible" },
  },
  quitAttempts: {
    title: "Avez-vous déjà essayé d'arrêter la cigarette ?",
    subtitle:
      "Les essais passés ne sont pas des échecs. Ils nous aident à bâtir un plan plus intelligent pour vous.",
    never: {
      label: "Jamais",
      hint: "C'est mon premier vrai essai, ou je n'ai pas compté les essais précédents.",
    },
    once: {
      label: "Une fois",
      hint: "J'ai déjà essayé d'arrêter la cigarette une fois.",
    },
    multiple: {
      label: "Plusieurs fois",
      hint: "J'ai déjà essayé d'arrêter la cigarette plus d'une fois.",
    },
  },
  interests: {
    title: "Qu'est-ce qui vous aidera à rester sans cigarette ?",
    streak: {
      label: "Ma série sans cigarette",
      hint: "Voir les jours sans cigarette s'accumuler.",
    },
    money: {
      label: "L'argent que j'économise",
      hint: "Suivre ce que vous ne dépensez plus en paquets.",
    },
    health: {
      label: "Me sentir en meilleure santé",
      hint: "Respirer plus facilement après avoir arrêté.",
    },
    cravings: {
      label: "Gérer les envies",
      hint: "Des outils quand l'envie de fumer arrive.",
    },
    missions: {
      label: "Missions quotidiennes",
      hint: "De petites tâches qui renforcent votre sevrage.",
    },
    stats: {
      label: "Stats et insights",
      hint: "Voir clairement vos progrès sans cigarette.",
    },
    rewards: {
      label: "Récompenses et badges",
      hint: "Débloquer des victoires en restant sans tabac.",
    },
    routine: {
      label: "Une routine plus calme",
      hint: "Remplacer la cigarette par quelque chose de mieux.",
    },
  },
  profile: {
    title: "Créez votre profil d'arrêt",
    username: {
      label: "Nom d'utilisateur",
      placeholder: "@username",
      taken: "Ce nom d'utilisateur est déjà pris",
      required: "Entrez un nom d'utilisateur",
    },
    sex: {
      label: "Sexe",
      required: "Choisissez le sexe",
      female: { label: "Femme" },
      male: { label: "Homme" },
      prefer_not_say: { label: "Préfère ne pas dire" },
    },
    country: {
      required: "Choisissez un pays",
    },
    quitDate: {
      required: "Choisissez quand vous arrêterez",
    },
    birthdate: { label: "Date de naissance" },
  },
  nicotine: {
    title: "Parlez-nous de votre consommation",
    subtitle:
      "Nous estimerons l'argent économisé et les gains pour la santé pendant votre sevrage.",
    cigsPerDay: {
      label: "Cigarettes par jour",
      required: "Choisissez le nombre de cigarettes par jour",
    },
    habitYears: {
      label: "Depuis combien de temps fumez-vous ?",
      required: "Choisissez depuis combien de temps vous fumez",
    },
    packSize: {
      label: "Cigarettes par paquet",
      placeholder: "Entrez un nombre",
      required: "Entrez un nombre",
      invalid: "Entrez un nombre supérieur à 0",
    },
    price: {
      label: "Prix par paquet",
      placeholder: "Entrez un prix",
      required: "Entrez un prix",
    },
    "1_5": { label: "1 à 5", hint: "Fumeur occasionnel" },
    "6_10": { label: "6 à 10", hint: "Fumeur léger" },
    "11_15": { label: "11 à 15", hint: "Fumeur modéré" },
    "16_20": { label: "16 à 20", hint: "Environ 1 paquet par jour" },
    "21_30": { label: "21 à 30", hint: "Gros fumeur" },
    "31_40": { label: "31 à 40", hint: "Très gros fumeur" },
    "40_plus": { label: "40+", hint: "2 paquets ou plus par jour" },
    less_than_1: { label: "Moins d'1 an" },
    "1_3": { label: "1 à 3 ans" },
    "4_7": { label: "4 à 7 ans" },
    "8_15": { label: "8 à 15 ans" },
    "16_25": { label: "16 à 25 ans" },
    "25_plus": { label: "25 ans et plus" },
  },
  quitPlan: {
    whenTitle: "Quand allez-vous arrêter la cigarette ?",
    whenSubtitle:
      "Votre date d'arrêt démarre votre série sans cigarette et votre plan.",
    methodTitle: "Comment voulez-vous arrêter la cigarette ?",
    methodSubtitle: "Choisissez le parcours qui vous semble réaliste.",
    cold_turkey: {
      label: "Arrêt brutal",
      hint: "Arrêter complètement les cigarettes le jour J",
    },
    gradual: {
      label: "Progressif",
      hint: "Réduire progressivement jusqu'à zéro",
    },
    now: {
      label: "Arrêter maintenant",
      hint: "Votre série sans cigarette commence tout de suite",
    },
    custom: {
      label: "Choisir une date",
      hint: "Choisissez un jour selon le fuseau de votre appareil",
    },
  },
  analyzing: {
    title: "Création de votre plan d'arrêt",
    subtitle: "Personnalisation de Quitify selon vos habitudes…",
    task1: "Analyse de vos habitudes de tabagisme",
    task2: "Génération de votre plan personnalisé",
    task3: "Préparation de votre tableau de bord",
  },
  celebration: {
    signupTitle: "Votre histoire sans cigarette commence ici",
    signupSubtitle:
      "Créez un compte pour enregistrer vos progrès sur tous vos appareils.",
    loginTitle: "Bon retour",
    loginSubtitle: "Connectez-vous pour continuer à arrêter avec Quitify.",
    signUpGoogle: "S'inscrire avec Google",
    signInGoogle: "Se connecter avec Google",
    continueEmail: "Continuer avec l'e-mail",
    skipForNow: "Passer pour l'instant",
  },
} as const;
