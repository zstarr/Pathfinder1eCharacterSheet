import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CharacterService } from '../core/services/character.service';
import {
  distinctUntilChanged,
  pairwise,
  tap,
  throttleTime,
} from 'rxjs/operators';

import { asyncScheduler, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-character-sheet',
  templateUrl: './character-sheet.component.html',
  styleUrls: ['./character-sheet.component.scss'],
})
export class CharacterSheetComponent implements OnInit, OnDestroy {

  character: Observable<any>;
  charSheetChangeSub: Subscription;
  charForm: FormGroup;

  constructor(
    public characterService: CharacterService,
    private fb: FormBuilder,
  ) {
    this.initForm();
    this.character = this.characterService.character.pipe(
      tap((char) => {
        this.initForm();
        this.onChanges();
        if (char) this.charForm.patchValue(char);
      })
    );
  }

  ngOnDestroy(): void {
    if (this.charSheetChangeSub) this.charSheetChangeSub.unsubscribe();
  }

  ngOnInit(): void {}

  initForm() {
    this.charForm = this.fb.group({
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
      strAbilityScore: [''],
      tempStrScore: [''],
      dexAbilityScore: [''],
      tempDexScore: [''],
      conAbilityScore: [''],
      tempConScore:[''],
      intAbilityScore: [''],
      tempIntScore: [''],
      wisAbilityScore: [''],
      tempWisScore: [''],
      chaAbilityScore: [''],
      tempChaScore: [''],
      //defense
      tempACMod: [''],
      totalHp: [''],
      currentHp: ['']
        //dr
        //sr
        //saves
    });

  }

  onChanges() {

    this.charSheetChangeSub = this.charForm.valueChanges
      .pipe(
        throttleTime(500, asyncScheduler, {leading: true, trailing: true}),
        distinctUntilChanged(),
        pairwise()
      )
      .subscribe(([prevVal, nextVal]: [any, any]) => {
        this.characterService.saveCharacter(nextVal);
      });
  }

}
