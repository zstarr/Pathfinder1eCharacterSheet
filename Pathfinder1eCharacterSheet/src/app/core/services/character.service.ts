import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject, Observable } from 'rxjs';
import { Character } from '../models/character.model';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private characterDbString: string;

  private character = new BehaviorSubject<Character>(null);

  activeCharacter = this.character.asObservable();

  characterIds: number[];

  database: AngularFireDatabase;
  user: firebase.User;

  characters: BehaviorSubject<Character[]> = new BehaviorSubject<Character[]>(
    null
  );

  constructor(private db: AngularFireDatabase)
  {
    this.database = db;
  }

  loadCharacter(newCharacter: Character) {
    this.character.next(newCharacter);
    console.log(newCharacter);
    this.saveCharacter(newCharacter);
  }

  updateCharacters(uid: string) {
    this.characterDbString = 'users/' + uid + '/pathfinder1echaractersheets';
    this.database
      .list<Character>(this.characterDbString)
      .valueChanges()
      .subscribe((chars) => {
        this.characters.next(chars);
      });
  }

  saveCharacter(character: Character) {
    var charTable = this.database.object(
      this.characterDbString + '/' + character.id
    );
    charTable
      .update(character)
      .then(() => console.log('character submitted'))
      .catch((error) => console.log('error saving char: ', error));
  }
}
