import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Character } from '../core/models/character.model';
import { CharacterService } from '../core/services/character.service';
import { MatSidenav } from '@angular/material/sidenav';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit {

  @Input() sidenav: MatSidenav
  characters: Character[];

  constructor(
    private characterService: CharacterService,
    private router: Router,
    private afAuth: AngularFireAuth
    ) {
      this.afAuth.authState.subscribe(authState => {
      if(authState?.uid) {
        characterService.updateCharacters(authState?.uid);
      }
    });
      this.characterService.characters.subscribe(chars => this.characters = chars);
  }

  ngOnInit(): void {
  }

  loadCharacter(char: Character) {
    this.characterService.loadCharacter(char);
    this.sidenav ? this.sidenav.toggle() : null;
    this.router.navigate(['character']);
  }

}
