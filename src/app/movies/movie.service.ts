import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Movie } from './movie.model';
import { post } from 'selenium-webdriver/http';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private movies: Movie[] = [];
  private moviesUpdated = new Subject<Movie[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getMovieUpdateListener() {
    return this.moviesUpdated.asObservable();
  }

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

  getMovie(id: String) {
    return this.http.get<any>('http://localhost:3000/api/v1/movies/' + id);
  }

  addMovie(movie: Movie) {
    this.http.post<any>('http://localhost:3000/api/v1/movies', movie)
      .subscribe((response) => {
        movie.id = response.id;
        movie.slices = response.slices;
        this.movies.push(movie);
        this.moviesUpdated.next([...this.movies]);
        this.router.navigate(['/']);
      });
  }

  updateMovie(movieId: String, movie: Movie) {
    this.http.put<any>('http://localhost:3000/api/v1/movies/' + movieId, movie)
      .pipe(map((data) => {
        return {
          id: data._id,
          title: data.title,
          description: data.description,
          duration: data.duration,
          sliceDuration: data.sliceDuration,
          slices: data.slices
        };
      }))
      .subscribe((response) => {
        const updatedMovies = [...this.movies];
        const oldMovieIndex = updatedMovies.findIndex(m => m.id === movie.id);
        updatedMovies[oldMovieIndex] = response;
        this.movies = updatedMovies;
        this.moviesUpdated.next([...this.movies]);
        this.router.navigate(['/']);
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
