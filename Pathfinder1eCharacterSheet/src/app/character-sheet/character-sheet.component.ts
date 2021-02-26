import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-character-sheet',
  templateUrl: './character-sheet.component.html',
  styleUrls: ['./character-sheet.component.scss'],
})
export class CharacterSheetComponent implements OnInit, OnDestroy {

  Math = Math;
  character: Observable<any>;
  charEditSub: Subscription;
  charSub: Subscription;
  charEdit: FormGroup;
  charReference: Character;

  get dexMod(): number {return Math.floor((this.charReference?.dexAbilityScore + this.charReference?.tempDexScore - 10) / 2);}

  constructor(
    private characterService: CharacterService,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.initForm();
    this.character = this.characterService.subscribeCharacter().pipe(
      tap((char) => {
        this.initForm();
        this.onChanges();
        if (char) this.charEdit.patchValue(char);

      })
    );
    this.charSub = this.character.subscribe(
      (char) => {
        this.charReference = char;
      },
      (err) => {
        router.navigate(['characters']);
      }
    );

  }
  ngOnDestroy(): void {
    if (this.charSub) this.charSub.unsubscribe();
    if (this.charEditSub) this.charEditSub.unsubscribe();
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

  onChanges() {
    this.charEditSub = this.charEdit.valueChanges
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
