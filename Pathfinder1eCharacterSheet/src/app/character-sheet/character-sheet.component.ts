import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Character } from '../core/models/character.model';
import { CharacterService } from '../core/services/character.service';
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Router } from '@angular/router';

@Component({
  selector: 'app-character-sheet',
  templateUrl: './character-sheet.component.html',
  styleUrls: ['./character-sheet.component.scss'],
})
export class CharacterSheetComponent implements OnInit {
  character: Character;

  charEdit: FormGroup;

  constructor(
    private characterService: CharacterService,
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.afAuth.authState.subscribe();//d => console.log('auth state stuff'));
    this.characterService.activeCharacter.subscribe((character) => {
      if (!character) router.navigate(['characters']);
      this.character = character;
      this.initForm();
      this.onChanges();
    });
  }

  ngOnInit(): void {

  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  initForm() {
    this.charEdit = this.fb.group({
      characterName: [this.character?.characterName],
      alignment: [this.character?.alignment ? this.character.alignment : ''],
      level: [this.character?.level ? this.character.level : ''],
      diety: [this.character?.diety ? this.character.diety : ''],
      homeland: [this.character?.homeland ? this.character.homeland : ''],
      race: [this.character?.race ? this.character.race : ''],
      size: [this.character?.size ? this.character.size : ''],
      gender: [this.character?.gender ? this.character.gender : ''],
      age: [this.character?.age ? this.character.age : ''],
      height: [this.character?.height ? this.character.height : ''],
      weight: [this.character?.weight ? this.character.weight : ''],
      hair: [this.character?.hair ? this.character.hair : ''],
      eyes: [this.character?.eyes ? this.character.eyes : ''],
    });
  }

  onChanges() {
    this.charEdit.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(val => {
      this.updateCharacterValues();
    });

  }

  updateCharacterValues() {
    for (const field in this.charEdit.controls) {
      this.character[field] = this.charEdit.controls[field].value;
    }
    this.characterService.saveCharacter(this.character);
  }

}
