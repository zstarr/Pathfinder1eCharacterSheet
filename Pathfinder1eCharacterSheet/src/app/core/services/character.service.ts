import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from '../models/character.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  private character = new BehaviorSubject<Character>(null);

  activeCharacter = this.character.asObservable();

  constructor() { }

  loadCharacter(newCharacter: Character) {
    this.character.next(newCharacter);
  }

}
