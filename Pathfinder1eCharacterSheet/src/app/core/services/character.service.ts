import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Character } from '../models/character.model';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

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

  afUserSub: Subscription;
  loadedCharacterSub: Subscription;
  lastViewedSub: Subscription;
  updateCharsSub: Subscription;

  constructor(
    private router: Router,
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
    ) {
    this.database = db;
    this.afAuth.authState.subscribe(user => {
      if (user?.uid) {
        this.characterDbString = 'users/' + user.uid + '/pathfinder1echaractersheets';
        this.updateCharacters();
        this.lastViewedSub = this.getLastViewedCharacter();
      }
    });
  }

  loadCharacter(id: number) {
    this.afUserSub = this.loadedCharacterSub = this.db.object(this.characterDbString + '/characters/' + id).valueChanges().subscribe(char => {
      if(char) {
        this.character.next(char as Character);
        this.updateLastViewedCharacterById(id);
      }
    });
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
    var charTable = this.database.object(this.characterDbString + '/characters/' + id);
    charTable.set(newChar);
  }

  updateCharacters() {
    this.updateCharsSub = this.database
      .list<Character>(this.characterDbString + '/characters')
      .valueChanges()
      .subscribe((chars) => {
        this.characters.next(chars);
        if(chars.length == 0) this.router.navigate(['characters'])
      });
  }

  saveCharacter(character: Character) {
    var charTable = this.database.object(
      this.characterDbString + '/characters/' + character.id
    );
    charTable
      .update(character)
      //.then(() => )
      .catch((error) => console.log('error saving char: ', error));
  }

  deleteCharacter(character: Character) {
    this.database.object(this.characterDbString + '/characters/' + character.id).remove();
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

  logout() {
    if (this.afUserSub) this.afUserSub.unsubscribe();
    if (this.character) this.character.unsubscribe();
    if (this.lastViewedSub) this.lastViewedSub.unsubscribe();
    if (this.loadedCharacterSub) this.loadedCharacterSub.unsubscribe();
    if (this.updateCharsSub) this.updateCharsSub.unsubscribe();
    if (this.characters) this.characters.unsubscribe();
  }

}
