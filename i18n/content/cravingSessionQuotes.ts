import type { AppLocale } from "@/types/i18n/locale";

/** English craving-session speech bubble lines (above the avatar). */
const EN = [
  "This craving will pass, whether you smoke or not. Let it pass.",
  "You don't need a cigarette right now. You need a few more minutes.",
  "Every craving you beat makes the next one easier.",
  "The urge is temporary. Your progress is permanent.",
  "You've already survived every craving so far. This one is no different.",
  "A cigarette won't solve what's bothering you.",
  "Remember why you started. Your future self is counting on you.",
  "Cravings are a sign of healing, not a sign to give up.",
  "Stay with the discomfort. It won't last forever.",
  "You are stronger than a chemical addiction.",
  "Don't trade your progress for a few minutes of relief.",
  "The craving is loud, but it doesn't control you.",
  "One cigarette is never just one cigarette.",
  "You quit for a reason. That reason still matters.",
  "Freedom begins with moments exactly like this one.",
  "The urge will fade. Your pride will remain.",
  "Take it one craving at a time, not one year at a time.",
  "You're not missing out on smoking. You're gaining your life back.",
  "Your brain is asking for nicotine. You don't have to say yes.",
  "A craving is a visitor. You don't have to invite it in.",
  "The strongest part of you made the decision to quit.",
  "You've come too far to start over today.",
  "This feeling is temporary. Your health is forever.",
  "Cravings peak and fade. Stay the course.",
  "The cigarette isn't the reward. Freedom is.",
  "Imagine how proud you'll feel in 10 minutes.",
  "Don't let a moment decide your future.",
  "The urge is uncomfortable, not dangerous.",
  "Keep your streak alive. It's worth protecting.",
  "Your lungs are thanking you right now.",
  "This is how victories are built: one craving at a time.",
  "Nicotine wants attention. Don't give it any.",
  "You're becoming the person you wanted to be.",
  "The craving is passing through. Let it keep moving.",
  "Quitting isn't easy, but it's absolutely worth it.",
  "You are reclaiming control with every minute that passes.",
  "The best response to a craving is patience.",
  "The version of you that never gives up is winning.",
  "Breathe. Wait. Watch the craving lose its power.",
  "Your future is worth more than this urge.",
  "You're proving to yourself that you can do hard things.",
  "This craving doesn't define you.",
  "You don't need nicotine to get through today.",
  "Healing often feels uncomfortable. Keep going.",
  "Every craving resisted is evidence of your strength.",
  "You're not fighting forever. You're fighting for a few minutes.",
  "Trust the process. Thousands have done it, and so can you.",
  "This moment is an opportunity to choose yourself.",
  "The craving is temporary. Your freedom is lasting.",
  "Hold on. In a few minutes, you'll be glad you did.",
] as const;

/** French craving-session speech bubble lines (above the avatar). */
const FR = [
  "Cette envie passera, que vous fumiez ou non. Laissez-la passer.",
  "Vous n'avez pas besoin d'une cigarette maintenant. Vous avez besoin de quelques minutes de plus.",
  "Chaque envie que vous battez rend la suivante plus facile.",
  "L'envie est temporaire. Vos progrès sont durables.",
  "Vous avez déjà survécu à toutes les envies jusqu'ici. Celle-ci n'est pas différente.",
  "Une cigarette ne résoudra pas ce qui vous tracasse.",
  "Rappelez-vous pourquoi vous avez commencé. Votre futur compte sur vous.",
  "Les envies sont un signe de guérison, pas un signal d'abandonner.",
  "Restez avec l'inconfort. Ça ne durera pas éternellement.",
  "Vous êtes plus fort qu'une dépendance chimique.",
  "N'échangez pas vos progrès contre quelques minutes de soulagement.",
  "L'envie est bruyante, mais elle ne vous contrôle pas.",
  "Une cigarette n'est jamais qu'une seule cigarette.",
  "Vous avez arrêté pour une raison. Cette raison compte encore.",
  "La liberté commence exactement à des moments comme celui-ci.",
  "L'envie s'estompera. Votre fierté restera.",
  "Prenez-le une envie à la fois, pas une année à la fois.",
  "Vous ne ratez pas la cigarette. Vous récupérez votre vie.",
  "Votre cerveau demande de la nicotine. Vous n'êtes pas obligé de dire oui.",
  "Une envie est une visite. Vous n'avez pas à l'inviter à entrer.",
  "La partie la plus forte de vous a décidé d'arrêter.",
  "Vous êtes allé trop loin pour tout recommencer aujourd'hui.",
  "Ce sentiment est temporaire. Votre santé, elle, dure.",
  "Les envies montent puis baissent. Tenez le cap.",
  "La cigarette n'est pas la récompense. La liberté l'est.",
  "Imaginez à quel point vous serez fier dans 10 minutes.",
  "Ne laissez pas un instant décider de votre avenir.",
  "L'envie est inconfortable, pas dangereuse.",
  "Gardez votre série en vie. Elle mérite d'être protégée.",
  "Vos poumons vous remercient en ce moment.",
  "C'est ainsi que se construisent les victoires : une envie à la fois.",
  "La nicotine veut de l'attention. Ne lui en donnez pas.",
  "Vous devenez la personne que vous vouliez être.",
  "L'envie est en train de passer. Laissez-la continuer sa route.",
  "Arrêter n'est pas facile, mais ça en vaut absolument la peine.",
  "Vous reprenez le contrôle à chaque minute qui passe.",
  "La meilleure réponse à une envie, c'est la patience.",
  "La version de vous qui n'abandonne jamais est en train de gagner.",
  "Respirez. Attendez. Regardez l'envie perdre son pouvoir.",
  "Votre avenir vaut plus que cette envie.",
  "Vous vous prouvez que vous pouvez faire des choses difficiles.",
  "Cette envie ne vous définit pas.",
  "Vous n'avez pas besoin de nicotine pour passer la journée.",
  "Guérir est souvent inconfortable. Continuez.",
  "Chaque envie résistée est une preuve de votre force.",
  "Vous ne combattez pas pour toujours. Vous combattez pour quelques minutes.",
  "Faites confiance au processus. Des milliers l'ont fait, et vous aussi.",
  "Ce moment est une occasion de vous choisir.",
  "L'envie est temporaire. Votre liberté dure.",
  "Tenez bon. Dans quelques minutes, vous serez content de l'avoir fait.",
] as const;

const BY_LOCALE: Record<AppLocale, readonly string[]> = {
  en: EN,
  fr: FR,
};

export const CRAVING_SESSION_QUOTE_COUNT = EN.length;

export function getCravingSessionQuotes(locale: AppLocale): readonly string[] {
  return BY_LOCALE[locale] ?? EN;
}

export function pickCravingSessionQuoteIndex(locale: AppLocale = "en"): number {
  const quotes = getCravingSessionQuotes(locale);
  return Math.floor(Math.random() * quotes.length);
}

export function getCravingSessionQuote(locale: AppLocale, index: number): string {
  const quotes = getCravingSessionQuotes(locale);
  return quotes[index] ?? quotes[0] ?? EN[0];
}
