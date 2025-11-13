import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-background',
  standalone: false,
  template: `<canvas #canvas id="c" class="bg-canvas"></canvas>`,
  styleUrls: ['./background.scss'],
})
export class BackgroundComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private cW = 0;
  private cH = 0;
  private particles: Particle[] = [];
  private colors = ['#00ffff', '#ff00ff', '#00ff80', '#ffaa00', '#007bff'];

  ngAfterViewInit() {
    this.initCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    requestAnimationFrame(() => this.animate());
  }

  /** Initialize canvas and particles */
  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    this.createParticles();
  }

  /** Create glowing floating particles */
  private createParticles() {
    this.particles = [];
    const count = 80;
    for (let i = 0; i < count; i++) {
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.particles.push(
        new Particle(
          Math.random() * this.cW,
          Math.random() * this.cH,
          (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 0.6,
          color
        )
      );
    }
  }

  /** Handle responsive resize */
  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const dpr = window.devicePixelRatio || 1;
    this.cW = window.innerWidth;
    this.cH = window.innerHeight;
    canvas.width = this.cW * dpr;
    canvas.height = this.cH * dpr;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
  }

  /** Main animation loop */
  private animate() {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.fillRect(0, 0, this.cW, this.cH);

    // Draw particle network
    for (let i = 0; i < this.particles.length; i++) {
      const p1 = this.particles[i];
      p1.update(this.cW, this.cH);

      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist < 150) {
          this.ctx.strokeStyle = `${p1.color}33`;
          this.ctx.lineWidth = 0.6;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }

      p1.draw(this.ctx);
    }

    requestAnimationFrame(() => this.animate());
  }
}

/** 🌌 Floating particle node */
class Particle {
  constructor(
    public x: number,
    public y: number,
    public vx: number,
    public vy: number,
    public color: string
  ) {}

  update(cW: number, cH: number) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > cW) this.vx *= -1;
    if (this.y < 0 || this.y > cH) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 5);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}
