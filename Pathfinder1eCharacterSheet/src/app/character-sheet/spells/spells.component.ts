import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'char-sheet-spells',
  templateUrl: './spells.component.html',
  styleUrls: ['../character-sheet.component.scss']
})
export class SpellsComponent implements OnInit {

  @Input() formGroup: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
