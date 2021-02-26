export class Character {
  id: number;
  characterName: string;
  alignment: string;
  level: number;
  diety: string;
  homeland: string;
  race: string;
  size: string;
  gender: string;
  age: number;
  height: string;
  weight: string;
  hair: string;
  eyes: string;

  //Abilities
  strAbilityScore: number;
  tempStrScore: number;
  dexAbilityScore: number;
  tempDexScore: number;
  conAbilityScore: number;
  tempConScore: number;

  intAbilityScore: number;
  tempIntScore: number;
  wisAbilityScore: number;
  tempWisScore: number;
  chaAbilityScore: number;
  tempChaScore: number;

  //defense
  tempACMod: number;

  maxHp: number;
}
