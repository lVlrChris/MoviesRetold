import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovieListComponent } from './movies/movie-list/movie-list.component';
import { MovieCreateComponent } from './movies/movie-create/movie-create.component';

const routes: Routes = [
  { path: '', component: MovieListComponent },
  { path: 'create', component: MovieCreateComponent },
  { path: 'edit/:movieId', component: MovieCreateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
