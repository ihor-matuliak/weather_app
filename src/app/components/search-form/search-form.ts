import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-form',
  imports: [ReactiveFormsModule],
  templateUrl: './search-form.html',
  styleUrl: './search-form.scss',
})
export class SearchForm {
  readonly isLoading = input(false);
  readonly search = output<string>();

  protected readonly searchForm = new FormGroup({
    city: new FormControl('', { nonNullable: true }),
  });

  protected submit(): void {
    const city = this.searchForm.controls.city.value.trim();

    if (city) {
      this.search.emit(city);
    }
  }
}
