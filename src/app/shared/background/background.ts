import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-background',
  templateUrl: './background.html',
  styleUrls: ['./background.scss'],
  standalone: false,
})
export class Background implements AfterViewInit, OnDestroy {
  @ViewChild('particlesContainer', { static: true })
  particlesContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('root', { static: true }) rootRef!: ElementRef<HTMLDivElement>;

  private particleCount = 80;
  private timeouts = new Set<number>();
  private mouseListener?: (e: MouseEvent) => void;
  private createdParticles: HTMLElement[] = [];
  private autoCreatedParticles: HTMLElement[] = [];

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Create initial particles
    for (let i = 0; i < this.particleCount; i++) {
      this.createParticle(/*auto=*/ true);
    }

    // Mouse interaction
    this.mouseListener = (e: MouseEvent) => this.onMouseMove(e);
    window.addEventListener('mousemove', this.mouseListener);
  }

  ngOnDestroy(): void {
    // clear timeouts
    this.timeouts.forEach((id) => clearTimeout(id));
    this.timeouts.clear();

    if (this.mouseListener) {
      window.removeEventListener('mousemove', this.mouseListener);
    }

    // remove any leftover particles
    this.createdParticles.forEach((p) => p.remove());
    this.autoCreatedParticles.forEach((p) => p.remove());
  }

  private createParticle(auto = false) {
    const container = this.particlesContainerRef.nativeElement;
    const particle = this.renderer.createElement('div') as HTMLDivElement;
    this.renderer.addClass(particle, 'particle');

    const size = Math.random() * 3 + 1; // small
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    container.appendChild(particle);

    if (auto) {
      this.autoCreatedParticles.push(particle);
      this.animateParticle(particle);
    } else {
      this.createdParticles.push(particle);
      // schedule removal for mouse-created particles after animation
      const removeTimeout = window.setTimeout(() => {
        particle.remove();
        this.createdParticles = this.createdParticles.filter((p) => p !== particle);
      }, 2200); // matches 2s animation
      this.timeouts.add(removeTimeout);
    }
  }

  private resetParticle(particle: HTMLElement) {
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.opacity = '0';
    return { x: posX, y: posY };
  }

  private animateParticle(particle: HTMLElement) {
    const pos = this.resetParticle(particle);

    const duration = Math.random() * 10 + 10; // seconds
    const delay = Math.random() * 5 * 1000; // ms

    const startTimeout = window.setTimeout(() => {
      // set transition and move
      particle.style.transition = `all ${duration}s linear`;
      particle.style.opacity = (Math.random() * 0.3 + 0.1).toString();

      const moveX = pos.x + (Math.random() * 20 - 10);
      const moveY = pos.y - Math.random() * 30;

      particle.style.left = `${moveX}%`;
      particle.style.top = `${moveY}%`;

      // after animation ends, schedule next animateParticle for this element
      const afterTimeout = window.setTimeout(() => {
        // remove inline transition to allow reset without visible jump
        particle.style.transition = '';
        this.animateParticle(particle);
      }, duration * 1000);

      this.timeouts.add(afterTimeout);
    }, delay);

    this.timeouts.add(startTimeout);
  }

  private onMouseMove(e: MouseEvent) {
    // spawn a small particle at mouse location
    const rect = document.documentElement.getBoundingClientRect();
    const mouseX = (e.clientX / window.innerWidth) * 100;
    const mouseY = (e.clientY / window.innerHeight) * 100;

    const particle = this.renderer.createElement('div') as HTMLDivElement;
    this.renderer.addClass(particle, 'particle');
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${mouseX}%`;
    particle.style.top = `${mouseY}%`;
    particle.style.opacity = '0.6';

    this.particlesContainerRef.nativeElement.appendChild(particle);
    this.createdParticles.push(particle);

    // animate outward then remove
    // minimal timeout to ensure style applied
    const t1 = window.setTimeout(() => {
      particle.style.transition = 'all 2s ease-out';
      particle.style.left = `${mouseX + (Math.random() * 10 - 5)}%`;
      particle.style.top = `${mouseY + (Math.random() * 10 - 5)}%`;
      particle.style.opacity = '0';
    }, 10);
    this.timeouts.add(t1);

    const t2 = window.setTimeout(() => {
      particle.remove();
      this.createdParticles = this.createdParticles.filter((p) => p !== particle);
    }, 2010);
    this.timeouts.add(t2);

    // subtle movement of gradient spheres
    const spheres = this.rootRef.nativeElement.querySelectorAll(
      '.gradient-sphere'
    ) as NodeListOf<HTMLElement>;
    const moveX = (e.clientX / window.innerWidth - 0.5) * 5; // px
    const moveY = (e.clientY / window.innerHeight - 0.5) * 5; // px

    spheres.forEach((sphere) => {
      // get existing computed transform, but we override to simple translate
      // keep scale/animation by applying translate only (note: this will replace transform used by keyframes)
      sphere.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  }
}
