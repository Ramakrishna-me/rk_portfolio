import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  @HostListener('window:scroll')
  onScroll() {
    const elements = document.querySelectorAll('.reveal');
    const triggerPoint = window.innerHeight - 150;

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect().top;
      if (rect < triggerPoint) el.classList.add('in-view');
    });
  }

  ngAfterViewInit() {
    const sections = document.querySelectorAll('.section-block');

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    });

    sections.forEach((s) => obs.observe(s));
  }
}
