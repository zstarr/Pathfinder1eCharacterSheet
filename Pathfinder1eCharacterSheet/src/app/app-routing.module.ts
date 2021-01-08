import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CharacterSheetComponent } from './character-sheet/character-sheet.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  { path: 'characters', component: CharacterSheetComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
