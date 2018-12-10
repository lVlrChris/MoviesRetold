import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Movie } from './movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private movies: Movie[] = [];
  private moviesUpdated = new Subject<Movie[]>();

  constructor() { }

  getMovies() {
    return [...this.movies];
  }

  getMovieUpdateListener() {
    return this.moviesUpdated.asObservable();
  }

  addMovie(movie: Movie) {
    this.movies.push(movie);
    this.moviesUpdated.next([...this.movies]);
  }
}
