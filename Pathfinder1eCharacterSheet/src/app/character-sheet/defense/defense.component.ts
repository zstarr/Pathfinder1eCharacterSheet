import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CharacterService } from 'src/app/core/services/character.service';

@Component({
  selector: 'char-sheet-defense',
  templateUrl: './defense.component.html',
  styleUrls: ['../character-sheet.component.scss']
})
export class DefenseComponent implements OnInit {

  @Input() formGroup: FormGroup;

  constructor(public characterService: CharacterService) { }

  ngOnInit(): void {
  }

}
