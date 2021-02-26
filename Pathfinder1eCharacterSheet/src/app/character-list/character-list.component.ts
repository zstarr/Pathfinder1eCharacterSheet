import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Character } from '../core/models/character.model';
import { CharacterService } from '../core/services/character.service';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss'],
})
export class CharacterListComponent implements OnInit, OnDestroy {
  @Input() sidenav: MatSidenav;
  characters: Character[];
  charsSub: Subscription;

  constructor(
    private characterService: CharacterService,
    private router: Router,
  ) {
    this.charsSub = this.characterService.characters.subscribe(
      (chars) => (this.characters = chars)
    );
  }

  ngOnDestroy(): void {
    this.charsSub.unsubscribe();
  }

  ngOnInit(): void {}

  loadCharacter(char: Character) {
    this.characterService.loadCharacter(char.id);
    this.sidenav ? this.sidenav.toggle() : null;
    this.router.navigate(['character']);
  }

  addCharacter() {
    this.characterService.newCharacter();
  }
}
