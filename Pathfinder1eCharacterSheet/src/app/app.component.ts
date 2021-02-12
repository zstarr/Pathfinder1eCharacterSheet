import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { CharacterService } from './core/services/character.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('drawer') public sidenav: MatSidenav;

  showFiller: boolean = false;
  title = 'Pathfinder1eCharacterSheet';

  constructor(
    public auth: AngularFireAuth,
    private router: Router,
    private charService: CharacterService
    ) {

  }

  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.router.navigate(['characters']);
  }

  logout() {
    this.charService.logout();
    this.auth.signOut();
    this.sidenav ? this.sidenav.toggle() : null;
    this.router.navigate(['home']);
  }

}
