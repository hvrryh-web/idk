export interface Technique {
  id: string;
  name: string;
  description: string;
  type: string;
}

export const techniques: Technique[] = [
  {
    id: "sky-piercer",
    name: "Sky Piercer",
    description: "Lu Bu's signature spear attack, cleaving through enemy ranks with unstoppable force.",
    type: "Attack"
  },
  {
    id: "red-hare-charge",
    name: "Red Hare Charge",
    description: "Lu Bu mounts Red Hare and charges, breaking enemy lines and causing chaos.",
    type: "Mobility"
  },
  {
    id: "moonlit-dance",
    name: "Moonlit Dance",
    description: "Diao Chan's graceful movement mesmerizes foes, lowering their defenses.",
    type: "Support"
  },
  {
    id: "whispered-scheme",
    name: "Whispered Scheme",
    description: "Diao Chan manipulates the battlefield with subtle intrigue, turning enemies against each other.",
    type: "Control"
  }
];
