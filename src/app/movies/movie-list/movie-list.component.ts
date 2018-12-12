import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

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
  totalMovies = 0;
  moviesPerPage = 4;
  currentPage = 1;
  pageSizeOptions = [ 2, 4, 8 ];
  private movieSub: Subscription;


  constructor(private movieService: MovieService) { }

  ngOnInit() {
    this.movieService.getMovies(this.moviesPerPage, this.currentPage);
    this.isLoading = true;
    this.movieSub = this.movieService.getMovieUpdateListener()
      .subscribe((movieData: { movies: Movie[], movieCount: number }) => {
        this.isLoading = false;
        this.movies = movieData.movies;
        this.totalMovies = movieData.movieCount;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.moviesPerPage = pageData.pageSize;
    this.movieService.getMovies(this.moviesPerPage, this.currentPage);
  }

  onDelete(movieId: String) {
    this.isLoading = true;
    this.movieService.deleteMovie(movieId).subscribe(() => {
        this.movieService.getMovies(this.moviesPerPage, this.currentPage);
      });
  }

  ngOnDestroy() {
    this.movieSub.unsubscribe();
  }
}
