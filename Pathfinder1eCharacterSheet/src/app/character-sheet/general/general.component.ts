import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CharacterSize, CharacterSizes } from "../../core/models/character-size.model";

interface MatSelectFields {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'char-sheet-general',
  templateUrl: './general.component.html',
  styleUrls: ['../character-sheet.component.scss']
})
export class GeneralComponent implements OnInit {

  @Input() formGroup: FormGroup;

  characterSizes: CharacterSize[] = CharacterSizes;

  alignments: MatSelectFields[] = [
    { value: 'lg', viewValue: 'Lawful Good'},
    { value: 'ng', viewValue: 'Neutral Good'},
    { value: 'cg', viewValue: 'Chaotic Good'},
    { value: 'ln', viewValue: 'Lawful Neutral'},
    { value: 'tn', viewValue: 'Neutral'},
    { value: 'cn', viewValue: 'Chaotic Neutral'},
    { value: 'le', viewValue: 'Lawful Evil'},
    { value: 'ne', viewValue: 'Neutral Evil'},
    { value: 'ce', viewValue: 'Chaotic Evil'}
  ];

  constructor() { }

  ngOnInit(): void {
  }

  compareSize = function(option, value) {
    return option?.creatureSize === value?.creatureSize;
  }

}
