export interface Character {
  id: string;
  name: string;
  portrait: string;
  faction: string;
  description: string;
  techniques: string[];
}

export const characters: Character[] = [
  {
    id: "lu-bu",
    name: "Lu Bu",
    portrait: "/assets/characters/lu-bu-yuto-sano.jpg",
    faction: "Independent",
    description: "The mighty warrior of the Three Kingdoms, famed for his strength and martial prowess.",
    techniques: ["Sky Piercer", "Red Hare Charge"]
  },
  {
    id: "diao-chan",
    name: "Diao Chan",
    portrait: "/assets/characters/diao-chan-yuto-sano.jpg",
    faction: "Independent",
    description: "A legendary beauty and master of intrigue, whose presence sways the fate of kingdoms.",
    techniques: ["Moonlit Dance", "Whispered Scheme"]
  }
];
