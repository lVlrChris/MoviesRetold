import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Movie } from '../movie.model';
import { MovieService } from '../movie.service';
import { durationValidator } from './duration.validator';

@Component({
  selector: 'app-movie-create',
  templateUrl: './movie-create.component.html',
  styleUrls: ['./movie-create.component.sass']
})
export class MovieCreateComponent implements OnInit {
  mode = 'create';
  private movieId: String;
  movie: Movie;
  isLoading = false;
  form: FormGroup;

  constructor(private movieService: MovieService, public route: ActivatedRoute) { }

  ngOnInit() {
    // Form validation setup
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required]
      }),
      description: new FormControl(null)
    });

    // Get existing movie for editing
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
            slices: movieData.slices,
            creator: movieData.creator
          };
          // Fill form with data
          this.form.setValue({ title: this.movie.title, description: this.movie.description});
        });
      } else {
        this.mode = 'create';
        this.movieId = null;

        // Add validation for duration and slice duration to form
        this.form.addControl('duration', new FormControl(null, {
          validators: [Validators.required, Validators.pattern('[0-9]*')]
        }));
        this.form.addControl('sliceDuration', new FormControl(null, {
          validators: [Validators.required, Validators.pattern('[0-9]*')]
        }));
      }
    });
  }

  onSaveMovie() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

    if (this.mode === 'create') {
      const movie: Movie = {
        id: undefined,
        title: this.form.value.title,
        description: '' + this.form.value.description,
        duration: this.form.value.duration,
        sliceDuration: this.form.value.sliceDuration,
        slices: undefined,
        creator: undefined
      };

      this.movieService.addMovie(movie);
      this.form.reset();

    } else {
      const movie: Movie = {
        id: undefined,
        title: this.form.value.title,
        description: this.form.value.description,
        duration: undefined,
        sliceDuration: undefined,
        slices: undefined,
        creator: undefined
      };

      this.movieService.updateMovie(this.movieId, movie);
    }
  }
}
