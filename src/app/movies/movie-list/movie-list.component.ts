import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

import { Movie } from '../movie.model';
import { MovieService } from 'src/app/movies/movie.service';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';

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
  userIsAuth = false;
  user: User;
  totalMovies = 0;
  moviesPerPage = 4;
  currentPage = 1;
  pageSizeOptions = [ 2, 4, 8 ];
  private movieSub: Subscription;
  private authStatusSub: Subscription;

  constructor(private movieService: MovieService, private authService: AuthService) { }

  ngOnInit() {
    this.movieService.getMovies(this.moviesPerPage, this.currentPage);
    this.isLoading = true;
    this.user = this.authService.getUser();
    this.movieSub = this.movieService.getMovieUpdateListener()
      .subscribe((movieData: { movies: Movie[], movieCount: number }) => {
        this.isLoading = false;
        this.movies = movieData.movies;
        this.user = this.authService.getUser();
        this.totalMovies = movieData.movieCount;
      });

    this.userIsAuth = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuth = isAuthenticated;
        this.user = this.authService.getUser();
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
      }, () => {
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.movieSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
