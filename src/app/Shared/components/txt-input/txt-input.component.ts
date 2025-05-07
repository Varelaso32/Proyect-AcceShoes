import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-txt-input',
  imports: [
    FormsModule
  ],
  templateUrl: './txt-input.component.html',
})
export class TxtInputComponent {

  @Input() placeholder: string = 'Escriba';
  @Input() value: string = '';

  onInputChange(event: Event) {

    const input = (event.target as HTMLInputElement).value;
    this.value = input.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    (event.target as HTMLInputElement).value = this.value;

  }
}
