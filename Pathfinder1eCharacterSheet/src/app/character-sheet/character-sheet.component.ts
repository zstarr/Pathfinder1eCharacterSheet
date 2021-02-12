import { Component, OnInit } from '@angular/core';
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
  character: Observable<any>;

  charEdit: FormGroup;
  charReference: Character;

  strMod = new BehaviorSubject<number>(0);
  dexMod = new BehaviorSubject<number>(0);
  conMod = new BehaviorSubject<number>(0);
  intMod = new BehaviorSubject<number>(0);
  wisMod = new BehaviorSubject<number>(0);
  chaMod = new BehaviorSubject<number>(0);

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
        this.updateCalculatedFields();
        this.onChanges();
        if (char) this.charEdit.patchValue(char);

      })
    );
    this.character.subscribe(
      (char) => {
        this.charReference = char;
        this.updateCalculatedFields()
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
      characterName: [''],
      alignment: [''],
      level: [''],
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
      strAbilityScore: [''],
      tempStrengthScore: [''],
      dexAbilityScore: [''],
      tempDexScore: [''],
      conAbilityScore: [''],
      tempConScore:['']
    });
  }

  updateCalculatedFields() {
    this.strMod.next(Math.floor((this.charReference?.strAbilityScore - 10) / 2));
    this.dexMod.next(Math.floor((this.charReference?.dexAbilityScore - 10) / 2));
    this.conMod.next(Math.floor((this.charReference?.conAbilityScore - 10) / 2));
    //this.intMod.next(Math.floor((this.charReference?.intAbilityScore - 10) / 2));
    //this.wisMod.next(Math.floor((this.charReference?.wisAbilityScore - 10) / 2));
    //this.chaMod.next(Math.floor((this.charReference?.chaAbilityScore - 10) / 2));
  }

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
