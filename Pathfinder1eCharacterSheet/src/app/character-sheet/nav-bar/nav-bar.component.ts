import { Component, Input, OnInit } from '@angular/core';
import { CharacterService } from 'src/app/core/services/character.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'char-sheet-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  @Input() character: Observable<any>;

  constructor(
    public characterService: CharacterService,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  scroll(el) {
    const element = document.querySelector(el)
    element ? element.scrollIntoView({behavior: "smooth"}): null;
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
    this.characterService.deleteActiveCharacter();
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
