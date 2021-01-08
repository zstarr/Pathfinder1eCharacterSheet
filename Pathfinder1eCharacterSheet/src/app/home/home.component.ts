import { Component, OnInit } from '@angular/core';
// import {AngularFireAuth} from '@angular/fire/auth';
// import {FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult} from 'firebaseui-angular';
// import {Router} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public auth: AngularFireAuth,
    public router: Router
    ) {
      this.auth.user ? this.router.navigate(['characters']) : null;
    }

  ngOnInit(): void {
  }

  async login() {
    await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.router.navigate(['characters']);
  }
  logout() {
    this.auth.signOut();
  }

}
