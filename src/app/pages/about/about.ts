import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.html',
  styleUrls: ['./about.scss'],
})
export class About {
  name = 'RK!';
  role = 'Frontend Developer & Graphic Designer';

  bio = `
    I’m a frontend developer and graphic designer who enjoys creating beautiful,
    functional and user-focused digital experiences. My work blends strong
    visual design with modern UI development to bring ideas to life with
    clarity and impact.

    I’m passionate about building clean interfaces, responsive layouts,
    reusable components and visually engaging designs. I love combining
    creativity with logic — turning concepts into real products that feel
    smooth and enjoyable for users.
  `;

  aboutPoints = [
    '3+ years experience in UI development and design',
    'Strong knowledge in Angular, TypeScript, HTML, SCSS',
    'Designing modern UI layouts with attention to detail',
    'Experience in Figma, Illustrator & Photoshop',
    'Creating responsive and mobile-first designs',
    'Building smooth transitions & micro-interactions',
    'Strong understanding of color, typography & layout',
    'Exploring creative visual ideas and animations',
  ];

  social = [
    { icon: 'fa-brands fa-behance', link: '#' },
    { icon: 'fa-brands fa-dribbble', link: '#' },
    { icon: 'fa-brands fa-twitter', link: '#' },
    { icon: 'fa-brands fa-instagram', link: '#' },
    { icon: 'fa-brands fa-linkedin', link: '#' },
  ];
}
