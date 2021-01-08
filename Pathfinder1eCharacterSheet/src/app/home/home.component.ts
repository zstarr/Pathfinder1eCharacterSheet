import { Component, OnInit } from '@angular/core';
// import {AngularFireAuth} from '@angular/fire/auth';
// import {FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult} from 'firebaseui-angular';
// import {Router} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public auth: AngularFireAuth) { }

  ngOnInit(): void {
  }

  // logout() {
  //   this.afAuth.signOut();
  // }

  // successCallback(data: FirebaseUISignInSuccessWithAuthResult) {
  //   console.log('successCallback', data);
  //   this.router.navigate(['character']);
  // }

  // errorCallback(data: FirebaseUISignInFailure) {
  //   console.warn('errorCallback', data);
  // }

  // uiShownCallback() {
  //   console.log('UI shown');
  // }
  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.auth.signOut();
  }

}
