export enum Sizes {
  fine = "Fine",
  diminutive = "Diminutive",
  tiny = "Tiny",
  small = "Small",
  medium = "Medium",
  large = "Large",
  huge = "Huge",
  gargantuan = "Gargantuan",
  colossal = "Colossal",
}

export interface CharacterSize {
  creatureSize: Sizes,
  mod: number,
  specialMod: number,
  flyMod: number,
  stealthMod: number
}

export const CharacterSizes: CharacterSize[] = [
  { creatureSize: Sizes.fine, mod: 8, specialMod: -8, flyMod: 8, stealthMod: 16 },
  { creatureSize: Sizes.diminutive, mod: 4, specialMod: -4, flyMod: 6, stealthMod: 16 },
  { creatureSize: Sizes.tiny, mod: 2, specialMod: -2, flyMod: 4, stealthMod: 8 },
  { creatureSize: Sizes.small, mod: 1, specialMod: -1, flyMod: 2, stealthMod: 4 },
  { creatureSize: Sizes.medium, mod: 0, specialMod: 0, flyMod: 0, stealthMod: 0 },
  { creatureSize: Sizes.large, mod: -1, specialMod: 1, flyMod: -2, stealthMod: -4 },
  { creatureSize: Sizes.huge, mod: -2, specialMod: 2, flyMod: -4, stealthMod: -8 },
  { creatureSize: Sizes.gargantuan, mod: -4, specialMod: 4, flyMod: -6, stealthMod: -12 },
  { creatureSize: Sizes.colossal, mod: -8, specialMod: 8, flyMod: -8, stealthMod: -16 },
];
