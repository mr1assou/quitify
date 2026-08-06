import { en } from "../en";

export const missions = {
  ...en.missions,
  noQuitDate:
    "Définissez votre date d'arrêt pendant l'onboarding pour débloquer votre plan de 180 jours.",
  planNotStarted:
    "Votre plan se débloque le jour où vous arrêtez. Terminez chaque jour pour débloquer le suivant.",
  module: "Module {{n}}",
  moduleHeading: "Module {{n}} : {{name}}",
  lockedTitle: "Le jour {{day}} est verrouillé",
  lockedMessage: "Terminez d'abord le jour {{previousDay}} pour débloquer ce jour.",
  notesTitle: "Notes du plan",
  yourNotes: "Vos notes",
  notesEmpty: "Aucune note pour le moment",
  notesEmptyHint:
    "Ouvrez un jour sur la carte, glissez jusqu'à une tâche, puis appuyez sur Ajouter une note pour enregistrer vos pensées ici.",
  addNote: "Ajouter une note",
  editNote: "Modifier la note",
  yourNote: "Votre note",
  notePlaceholder: "Comment s'est passée cette tâche ? Qu'avez-vous appris ?",
  noteHint:
    "Écrivez ce que vous voulez retenir de cette tâche. Cela apparaîtra dans Vos notes sur l'écran carte.",
  noteSaveFailed: "Impossible d'enregistrer la note.",
  saveNote: "Enregistrer",
  charactersCount: "{{count}}/{{max}} caractères",
  markDone: "Marquer comme fait",
  undo: "Annuler",
  taskOf: "Tâche {{current}} / {{total}}",
  taskFallback: "Tâche",
  bonusComplete: "Toutes les missions du jour sont terminées. Bravo.",
  dayTitle: "Votre plan pour le jour {{day}}",
  dayLockedCompleteEarlier: "Terminez les jours précédents pour débloquer ce plan.",
  dayShort: "Jour {{day}}",
  missionOfDay: "Mission du jour",
  missionComplete: "Mission terminée",
  stepsDone: "{{done}}/{{total}} étapes terminées",
};
