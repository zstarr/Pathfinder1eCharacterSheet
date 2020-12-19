import { Component, OnInit } from '@angular/core';
import { Character } from '../core/models/character.model';
import { CharacterService } from "../core/services/character.service";

@Component({
  selector: 'app-character-sheet',
  templateUrl: './character-sheet.component.html',
  styleUrls: ['./character-sheet.component.scss']
})
export class CharacterSheetComponent implements OnInit {

  character: Character;

  constructor(private characterService: CharacterService) {

    this.characterService.activeCharacter.subscribe(character => this.character = character);

  }

  ngOnInit(): void {
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

}
