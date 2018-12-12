import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Movie } from './movie.model';
import { post } from 'selenium-webdriver/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private movies: Movie[] = [];
  private moviesUpdated = new Subject<{ movies: Movie[], movieCount: number }>();
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  getMovieUpdateListener() {
    return this.moviesUpdated.asObservable();
  }

  getMovies(moviesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${moviesPerPage}&page=${currentPage}`;

    this.http
      .get<{ message: string, movies: any, maxMovies: number }>(`${this.apiUrl}api/v1/movies` + queryParams)
      .pipe(map((data) => {
        return { movies: data.movies.map(movie => {
          return {
            id: movie._id,
            title: movie.title,
            description: movie.description,
            duration: movie.duration,
            sliceDuration: movie.sliceDuration,
            slices: movie.slices
          };
        }), maxMovies: data.maxMovies };
      }))
      .subscribe((response) => {
        this.movies = response.movies;
        this.moviesUpdated.next({ movies: [...this.movies], movieCount: response.maxMovies });
      });
  }

  getMovie(id: String) {
    return this.http.get<any>(`${this.apiUrl}api/v1/movies/` + id);
  }

  addMovie(movie: Movie) {
    this.http.post<any>(`${this.apiUrl}api/v1/movies`, movie)
      .subscribe((response) => {
        // movie.id = response.id;
        // movie.slices = response.slices;
        // this.movies.push(movie);
        // this.moviesUpdated.next([...this.movies]);
        this.router.navigate(['/']);
      });
  }

  updateMovie(movieId: String, movie: Movie) {
    this.http.put<any>(`${this.apiUrl}api/v1/movies/` + movieId, movie)
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
        // const updatedMovies = [...this.movies];
        // const oldMovieIndex = updatedMovies.findIndex(m => m.id === movie.id);
        // updatedMovies[oldMovieIndex] = response;
        // this.movies = updatedMovies;
        // this.moviesUpdated.next([...this.movies]);
        this.router.navigate(['/']);
      });
  }

  deleteMovie(movieId: String) {
    return this.http.delete(`${this.apiUrl}api/v1/movies/` + movieId);
  }
}
