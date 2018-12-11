import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Movie } from '../movie.model';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-create',
  templateUrl: './movie-create.component.html',
  styleUrls: ['./movie-create.component.sass']
})
export class MovieCreateComponent implements OnInit {
  private mode = 'create';
  private movieId: String;
  movie: Movie;
  isLoading = false;

  constructor(private movieService: MovieService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('movieId')) {
        this.mode = 'edit';
        this.movieId = paramMap.get('movieId');

        this.isLoading = true;
        this.movieService.getMovie(this.movieId).subscribe(movieData => {

          this.isLoading = false;
          this.movie = {
            id: movieData._id,
            title: movieData.title,
            description: movieData.description,
            duration: movieData.duration,
            sliceDuration: movieData.sliceDuration,
            slices: movieData.slices
          };
        });
      } else {
        this.mode = 'create';
        this.movieId = null;
      }
    });
  }

  onSaveMovie(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;

    if (this.mode === 'create') {

      const movie: Movie = {
        id: undefined,
        title: form.value.title,
        description: form.value.description,
        duration: 10,
        sliceDuration: 2,
        slices: undefined
      };

      this.movieService.addMovie(movie);
      form.resetForm();

    } else {

      const movie: Movie = {
        id: undefined,
        title: form.value.title,
        description: form.value.description,
        duration: undefined,
        sliceDuration: undefined,
        slices: undefined
      };

      this.movieService.updateMovie(this.movieId, movie);
    }
  }
}
