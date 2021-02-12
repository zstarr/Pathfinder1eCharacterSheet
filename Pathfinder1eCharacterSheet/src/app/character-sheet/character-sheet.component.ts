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
import { Observable } from 'rxjs';

@Component({
  selector: 'app-character-sheet',
  templateUrl: './character-sheet.component.html',
  styleUrls: ['./character-sheet.component.scss'],
})
export class CharacterSheetComponent implements OnInit {
  character: Observable<any>;

  charEdit: FormGroup;
  charReference: Character;

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
        this.onChanges();
        if (char) this.charEdit.patchValue(char);
      })
    );

    this.character.subscribe(
      (char) => {
        this.charReference = char;
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
    });
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
