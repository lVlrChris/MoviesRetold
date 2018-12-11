import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Movie } from './movie.model';
import { post } from 'selenium-webdriver/http';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private movies: Movie[] = [];
  private moviesUpdated = new Subject<Movie[]>();

  constructor(private http: HttpClient) { }

  getMovies() {
    this.http
      .get<any>('http://localhost:3000/api/v1/movies')
      .pipe(map((data) => {
        return data.map(movie => {
          return {
            id: movie._id,
            title: movie.title,
            description: movie.description,
            duration: movie.duration,
            sliceDuration: movie.sliceDuration,
            slices: movie.slices
          };
        });
      }))
      .subscribe((response) => {
        this.movies = response;
        this.moviesUpdated.next([...this.movies]);
      });
  }

  getMovieUpdateListener() {
    return this.moviesUpdated.asObservable();
  }

  addMovie(movie: Movie) {
    this.http.post<any>('http://localhost:3000/api/v1/movies', movie)
      .subscribe((response) => {
        movie.id = response._id;
        movie.slices = response.slices;
        this.movies.push(movie);
        this.moviesUpdated.next([...this.movies]);
      });
  }

  deleteMovie(movieId: String) {
    this.http.delete('http://localhost:3000/api/v1/movies/' + movieId)
      .subscribe(() => {
        const updatedMovies = this.movies.filter(movie => movie.id !== movieId);
        this.movies = updatedMovies;
        this.moviesUpdated.next([...this.movies]);
      });
  }
}
