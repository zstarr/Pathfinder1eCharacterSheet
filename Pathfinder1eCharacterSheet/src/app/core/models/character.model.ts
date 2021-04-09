import { CharacterSize } from "./character-size.model";

export class Character {
  id: number;
  characterName: string;
  alignment: string;
  level: number = 1;
  diety: string;
  homeland: string;
  race: string;
  size: CharacterSize;
  gender: string;
  age: number;
  height: string;
  weight: string;
  hair: string;
  eyes: string;

  //Abilities
  strAbilityScore: number = 10;
  tempStrScore: number = 0;
  dexAbilityScore: number = 10;
  tempDexScore: number = 0;
  conAbilityScore: number = 10;
  tempConScore: number = 0;

  intAbilityScore: number = 10;
  tempIntScore: number = 0;
  wisAbilityScore: number = 10;
  tempWisScore: number = 0;
  chaAbilityScore: number = 10;
  tempChaScore: number = 0;

  //Saves
  fortSaveMod: number = 0;
  refSaveMod: number = 0;
  willSaveMod: number = 0;

  //defense
  tempACMod: number = 0;

  maxHp: number = 0;
}
