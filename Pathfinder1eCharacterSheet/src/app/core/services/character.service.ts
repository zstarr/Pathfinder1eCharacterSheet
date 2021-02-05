import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Character } from '../models/character.model';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private characterDbString: string;

  private character = new BehaviorSubject<Character>(null);

  activeCharacter = this.character.asObservable();

  database: AngularFireDatabase;
  user: firebase.User;

  lastViewedCharId;

  characters: BehaviorSubject<Character[]> = new BehaviorSubject<Character[]>(
    null
  );

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
    ) {
    this.database = db;
    this.afAuth.authState.subscribe(user => {
      if (user?.uid) {
        this.characterDbString = 'users/' + user.uid + '/pathfinder1echaractersheets';
        this.updateCharacters();
        this.getLastViewedCharacter();
      }
    });
  }

  loadCharacter(id: number) {
    this.updateLastViewedCharacterById(id);
    this.db.object(this.characterDbString + '/' + id).valueChanges().subscribe(char => {
      this.character.next(char as Character);
    })
  }

  subscribeCharacter(): Observable<any> {
    return this.activeCharacter;
  }

  newCharacter() {
    var id = this.characters.value.length;
    if (!id) {
      id = 0;
    }
    let newChar = new Character();
    newChar.id = id;
    newChar.characterName = "New Character";
    var charTable = this.database.object(this.characterDbString + '/' + id);
    charTable.set(newChar);
  }

  updateCharacters() {
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
      //.then(() => )
      .catch((error) => console.log('error saving char: ', error));
  }

  deleteCharacter(character: Character) {
    this.database.object(this.characterDbString + '/' + character.id).remove();
  }

  getLastViewedCharacter(): Subscription {
    return this.database
      .object(this.characterDbString + '/lastViewedCharacter').valueChanges().subscribe(charId => {
        if (!charId) this.updateLastViewedCharacterById(0);
        this.lastViewedCharId = charId;
        this.loadCharacter(this.lastViewedCharId);
      });
  }

  updateLastViewedCharacterById(id: number) {
    this.database
    .object(this.characterDbString + '/lastViewedCharacter').set(id);
  }

}
