import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Movie } from '../movie.model';
import { MovieService } from 'src/app/movies/movie.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.sass']
})
export class MovieListComponent implements OnInit, OnDestroy {

  // movies = [
  //   {title: 'First movie', content: 'This is the first movie'},
  //   {title: 'Second movie', content: 'This is the second movie'},
  //   {title: 'Third movie', content: 'This is the third movie'},
  //   {title: 'Fourth movie', content: 'This is the fourth movie'},
  // ];

  movies: Movie[] = [];
  isLoading = false;
  private movieSub: Subscription;

  constructor(private movieService: MovieService) { }

  ngOnInit() {
    this.movieService.getMovies();
    this.isLoading = true;
    this.movieSub = this.movieService.getMovieUpdateListener()
      .subscribe((movies: Movie[]) => {
        this.isLoading = false;
        this.movies = movies;
      });
  }

  onDelete(movieId: String) {
    this.movieService.deleteMovie(movieId);
  }

  ngOnDestroy() {
    this.movieSub.unsubscribe();
  }
}
