import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Character } from '../models/character.model';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { pairwise } from 'rxjs/operators';
import { CharacterSizes } from "../models/character-size.model";

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private characterDbString: string;
  database: AngularFireDatabase;
  user: firebase.User;

  allCharacters: BehaviorSubject<Character[]> = new BehaviorSubject<Character[]>(null);
  public character = new BehaviorSubject<Character>(null);
  lastViewedCharId: number;

  loadedCharacterSub: Subscription;
  lastViewedSub: Subscription;
  updateCharsSub: Subscription;

  characterSizes = CharacterSizes;

  strMod: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  dexMod: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  conMod: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  intMod: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  wisMod: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  chaMod: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  AC: BehaviorSubject<number> = new BehaviorSubject<number>(10);
  touchAC: BehaviorSubject<number> = new BehaviorSubject<number>(10);
  flatFootedAC: BehaviorSubject<number> = new BehaviorSubject<number>(10);
  armorMod: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  sizeMod: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  fortSave: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  refSave: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  willSave: BehaviorSubject<number> = new BehaviorSubject<number>(0);

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

    this.character.pipe(pairwise()).subscribe(([prevVal, nextVal]: [Character, Character]) => {
      this.updateAbilityScores(nextVal);
      this.updateSaveScores(nextVal);
      this.sizeMod.next(nextVal.size?.mod ? nextVal.size.mod : 0)
      this.AC.next(10 + this.dexMod.value + nextVal.tempACMod + this.armorMod.value + this.sizeMod.value);
      this.flatFootedAC.next(this.AC.value - this.dexMod.value);
      this.touchAC.next(this.AC.value - this.armorMod.value); // - armor/shield/natural
    });
  }

  updateSaveScores(char: Character) {
    this.fortSave.next(char.fortSaveMod + this.conMod.value);
    this.refSave.next(char.refSaveMod + this.dexMod.value);
    this.willSave.next(char.willSaveMod + this.wisMod.value);
  }

  updateAbilityScores(char: Character) {
    this.strMod.next(Math.floor((char.strAbilityScore + char.tempStrScore - 10) / 2));
    this.dexMod.next(Math.floor((char.dexAbilityScore + char.tempDexScore - 10) / 2));
    this.conMod.next(Math.floor((char.conAbilityScore + char.tempConScore - 10) / 2));
    this.intMod.next(Math.floor((char.intAbilityScore + char.tempIntScore - 10) / 2));
    this.wisMod.next(Math.floor((char.wisAbilityScore + char.tempWisScore - 10) / 2));
    this.chaMod.next(Math.floor((char.chaAbilityScore + char.tempChaScore - 10) / 2));
  }

  loadCharacter(id: number) {
    if (this.loadedCharacterSub) this.loadedCharacterSub.unsubscribe();

    this.loadedCharacterSub = this.db.object(this.characterDbString + '/characters/' + id).valueChanges().subscribe(char => {
      if(char) {
        this.character.next(char as Character);
        this.updateLastViewedCharacterById(id);
      }
    });
  }

  newCharacter() {
    var id = this.allCharacters.value.length;
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
        this.allCharacters.next(chars);
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

  deleteActiveCharacter() {
    this.database.object(this.characterDbString + '/characters/' + this.character.value.id).remove();
  }

  getLastViewedCharacter(): Subscription {
    return this.database
      .object(this.characterDbString + '/lastViewedCharacter').valueChanges().subscribe(charId => {
        if (!charId) this.updateLastViewedCharacterById(0);
        this.lastViewedCharId = Number(charId);
        this.loadCharacter(this.lastViewedCharId);
      });
  }

  updateLastViewedCharacterById(id: number) {
    this.database
    .object(this.characterDbString + '/lastViewedCharacter').set(id);
  }

  logout() {
    if (this.lastViewedSub) this.lastViewedSub.unsubscribe();
    if (this.loadedCharacterSub) this.loadedCharacterSub.unsubscribe();
    if (this.updateCharsSub) this.updateCharsSub.unsubscribe();
  }

}
