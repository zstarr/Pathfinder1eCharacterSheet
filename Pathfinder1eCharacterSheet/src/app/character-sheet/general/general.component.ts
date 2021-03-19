import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'char-sheet-general',
  templateUrl: './general.component.html',
  styleUrls: ['../character-sheet.component.scss']
})
export class GeneralComponent implements OnInit {

  @Input() formGroup: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
