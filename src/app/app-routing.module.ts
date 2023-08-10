import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartSreenComponent } from './start-sreen/start-sreen.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  { path: '', component: StartSreenComponent },
  { path: 'game/:id', component: GameComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
