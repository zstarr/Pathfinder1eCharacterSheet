import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Character } from './core/models/character.model';
import { CharacterService } from './core/services/character.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('drawer') public sidenav: MatSidenav;

  showFiller: boolean = false;
  title = 'Pathfinder1eCharacterSheet';

  characters: Character[];

  constructor(private characterService: CharacterService) {
    this.characterService.characters.subscribe(chars => this.characters = chars);
  }

  loadCharacter(char: Character) {
    this.characterService.loadCharacter(char);
    this.sidenav.toggle();
  }
}
