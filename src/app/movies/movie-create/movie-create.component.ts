import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Movie } from '../movie.model';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-create',
  templateUrl: './movie-create.component.html',
  styleUrls: ['./movie-create.component.sass']
})
export class MovieCreateComponent implements OnInit {

  constructor(private movieService: MovieService) { }

  ngOnInit() {
  }

  onCreateMovie(form: NgForm) {
    if (form.invalid) {
      return;
    }

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
  }
}
