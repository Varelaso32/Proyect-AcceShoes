import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carrusel',
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.css'],
})
export class CarruselComponent implements OnInit {
  slides = [
    {
      id: 1,
      title: 'Producto 1',
      description: 'Descripción del producto 1.',
      imageUrl:
        'https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp',
    },
    {
      id: 2,
      title: 'Producto 2',
      description: 'Descripción del producto 2.',
      imageUrl:
        'https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp',
    },
    {
      id: 3,
      title: 'Producto 3',
      description: 'Descripción del producto 3.',
      imageUrl:
        'https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp',
    },
    {
      id: 4,
      title: 'Producto 4',
      description: 'Descripción del producto 4.',
      imageUrl:
        'https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp',
    },
    {
      id: 5,
      title: 'Producto 5',
      description: 'Descripción del producto 5.',
      imageUrl:
        'https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp',
    },
  ];

  currentSlideIndex: number = 0;

  constructor() {}

  ngOnInit(): void {}

  // Navegar al siguiente slide
  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
  }

  // Navegar al slide anterior
  prevSlide(): void {
    this.currentSlideIndex =
      (this.currentSlideIndex - 1 + this.slides.length) % this.slides.length;
  }
}
