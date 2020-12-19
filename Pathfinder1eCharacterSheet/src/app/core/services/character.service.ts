import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from '../models/character.model';
import { chars } from "./temp.data";

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  characters = new BehaviorSubject<Character[]>(chars);

  private character = new BehaviorSubject<Character>(null);

  activeCharacter = this.character.asObservable();

  characterIds: number[];

  constructor() { }

  loadCharacter(newCharacter: Character) {
    this.character.next(newCharacter);
  }

}
