import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  openGithub() {
    window.open('https://github.com/Ramakrishna-me', '_blank');
  }

  openInstagram() {
    window.open('https://www.instagram.com/krishna7_6_?igsh=MWU5NjlpbXVucm0zMw==', '_blank');
  }

  openLinkedin() {
    window.open('https://www.linkedin.com/in/ramakrishnan-r7/', '_blank');
  }

  closeMobileNav() {
    const menu = document.getElementById('navMenu');
    if (menu && menu.classList.contains('show')) {
      menu.classList.remove('show');
    }
  }
}
