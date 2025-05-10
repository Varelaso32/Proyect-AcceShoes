import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<
    'light' | 'dark' | 'system'
  >('system');
  public currentTheme$ = this.currentThemeSubject.asObservable();
  private darkModeMediaQuery = window.matchMedia(
    '(prefers-color-scheme: dark)'
  );

  constructor() {
    this.initializeTheme();
    this.setupSystemThemeListener();
  }

  private initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (
      savedTheme === 'light' ||
      savedTheme === 'dark' ||
      savedTheme === 'system'
    ) {
      this.currentThemeSubject.next(savedTheme);
    }
    this.applyTheme(this.getEffectiveTheme());
  }

  private setupSystemThemeListener() {
    this.darkModeMediaQuery.addEventListener('change', (e) => {
      if (this.currentThemeSubject.value === 'system') {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  getCurrentTheme(): 'light' | 'dark' | 'system' {
    return this.currentThemeSubject.value;
  }

  getEffectiveTheme() {
    const currentTheme = this.currentThemeSubject.value;
    if (currentTheme === 'system') {
      return this.darkModeMediaQuery.matches ? 'dark' : 'light';
    }
    return currentTheme;
  }

  changeTheme(theme: 'light' | 'dark' | 'system'): void {
    this.currentThemeSubject.next(theme);
    localStorage.setItem('theme', theme);
    this.applyTheme(this.getEffectiveTheme());
  }

  private applyTheme(theme: 'light' | 'dark') {
    // Aplicar a nivel de documento HTML
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');

    // También puedes añadir una clase global al body
    document.body.classList.toggle('dark-mode', theme === 'dark');
    document.body.classList.toggle('light-mode', theme === 'light');
  }

  isDarkMode(): boolean {
    return this.getEffectiveTheme() === 'dark';
  }
}
