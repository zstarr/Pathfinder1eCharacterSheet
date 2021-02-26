import { Component, OnChanges, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Character } from '../core/models/character.model';
import { CharacterService } from '../core/services/character.service';
import {
  debounceTime,
  distinctUntilChanged,
  pairwise,
  tap,
} from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-character-sheet',
  templateUrl: './character-sheet.component.html',
  styleUrls: ['./character-sheet.component.scss'],
})
export class CharacterSheetComponent implements OnInit {

  Math = Math;

  character: Observable<any>;

  charEdit: FormGroup;
  charReference: Character;

  get strMod(): number { return Math.floor((this.charReference?.strAbilityScore + this.charReference?.tempStrScore - 10) / 2) };
  dexMod = new BehaviorSubject<number>(0);
  conMod = new BehaviorSubject<number>(0);
  intMod = new BehaviorSubject<number>(0);
  wisMod = new BehaviorSubject<number>(0);
  chaMod = new BehaviorSubject<number>(0);
  ac = new BehaviorSubject<number>(0)
  constructor(
    private characterService: CharacterService,
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.initForm();
    this.character = this.characterService.subscribeCharacter().pipe(
      tap((char) => {
        this.initForm();
        //this.updateCalculatedFields();
        this.onChanges();
        if (char) this.charEdit.patchValue(char);

      })
    );
    this.character.subscribe(
      (char) => {
        this.charReference = char;
        //this.updateCalculatedFields()
      },
      (err) => {
        router.navigate(['characters']);
      }
    );

  }

  ngOnInit(): void {}

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  initForm() {
    this.charEdit = this.fb.group({
      id: [''],
      //general
      characterName: [''],
      alignment: [''],
      level: [1],
      diety: [''],
      homeland: [''],
      race: [''],
      size: [''],
      gender: [''],
      age: [''],
      height: [''],
      weight: [''],
      hair: [''],
      eyes: [''],
      //abilities
      strAbilityScore: [10],
      tempStrScore: [0],
      dexAbilityScore: [10],
      tempDexScore: [0],
      conAbilityScore: [10],
      tempConScore:[0],
      intAbilityScore: [10],
      tempIntScore: [0],
      wisAbilityScore: [10],
      tempWisScore: [0],
      chaAbilityScore: [10],
      tempChaScore: [0],
      //defense
      tempACMod: [0],
        //tempAC
        //hp
        //hp tracking
        //dr
        //sr
        //saves
    });
  }

  // updateCalculatedFields() {
  //   this.strMod.next(Math.floor((this.charReference?.strAbilityScore + this.charReference?.tempStrScore - 10) / 2));
  //   this.dexMod.next(Math.floor((this.charReference?.dexAbilityScore + this.charReference?.tempDexScore - 10) / 2));
  //   this.conMod.next(Math.floor((this.charReference?.conAbilityScore + this.charReference?.tempConScore - 10) / 2));
  //   this.intMod.next(Math.floor((this.charReference?.intAbilityScore + this.charReference?.tempIntScore - 10) / 2));
  //   this.wisMod.next(Math.floor((this.charReference?.wisAbilityScore + this.charReference?.tempWisScore - 10) / 2));
  //   this.chaMod.next(Math.floor((this.charReference?.chaAbilityScore + this.charReference?.tempChaScore - 10) / 2));
  //   this.ac.next(10 + this.dexMod.value + this.charReference?.tempACMod);
  //   console.log(this.charReference?.strAbilityScore)
  //   console.log(this.charReference?.tempStrScore)
  //   Math.floor((this.charReference?.strAbilityScore + this.charReference?.tempStrScore - 10) / 2)
  // }

  onChanges() {
    this.charEdit.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), pairwise())
      .subscribe(([prevVal, nextVal]: [any, any]) => {
        this.characterService.saveCharacter(nextVal);
      });
  }

  openDialog() {
    const dialogRef = this.dialog.open(CharacterDeleteDialog);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteForever();
      }
    });
  }

  deleteForever() {
    this.characterService.deleteCharacter(this.charReference);
    this.router.navigate(['characters']);
  }

  printCharacter() {
    console.log(this.character);
  }
}

@Component({
  selector: 'character-delete',
  templateUrl: 'character-delete.html',
})
export class CharacterDeleteDialog {}
