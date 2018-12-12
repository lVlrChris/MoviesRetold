import { Component, OnInit } from '@angular/core';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { MovieService } from '../movie.service';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { Movie } from '../movie.model';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.sass']
})
export class MovieDetailsComponent implements OnInit {
  isLoading = false;
  userIsAuth = false;
  userId: string;
  userFullName: string;
  movie: Movie;
  movieId: string;
  creator: User;
  private authStatusSub: Subscription;

  constructor(
    private movieService: MovieService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit() {
    // Setup loading status
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });

    // Get movie from route
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.movieId = paramMap.get('movieId');

      this.isLoading = true;
      this.movieService.getMovie(this.movieId).subscribe(movieData => {

        this.movie = {
          id: movieData._id,
            title: movieData.title,
            description: movieData.description,
            duration: movieData.duration,
            sliceDuration: movieData.sliceDuration,
            slices: movieData.slices,
            creator: movieData.creator
        };

        // Get user from movie creator
        this.authService.getUserById(this.movie.creator)
          .pipe(map((data) => {
            return {
              message: data.message,
              user: {
                id: data.user._id,
                email: data.user.email,
                firstName: data.user.firstName,
                lastName: data.user.lastName
              }
            };
          }))
          .subscribe(response => {
            this.isLoading = false;
            this.creator = response.user;
            this.userFullName = response.user.firstName + ' ' + response.user.lastName;
        });
      });
    });

    this.userIsAuth = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuth = isAuthenticated;
        this.userId = this.authService.getUser().id;
      });
  }

  onClaim(sliceId: string) {
    this.movieService.addClaim(this.movie.id, sliceId);
  }

  onDelete(movieId: string) {
    this.isLoading = true;
    this.movieService.deleteMovie(movieId).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
