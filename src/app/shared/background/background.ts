import { Component, ElementRef, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import anime from 'animejs/lib/anime.es.js';

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
  private bgColor = '#FF6138';
  private animations: any[] = [];
  private colors = ['#ffd000ff', '#ff8441ff', '#278bceff', '#c41cd3ff'];
  private colorIndex = 0;

  ngAfterViewInit() {
    this.initCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.addClickListeners();
    this.startInactiveWatcher();

    anime({
      duration: Infinity,
      update: () => {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.cW, this.cH);

        this.animations.forEach((a) => {
          a.animatables.forEach((t: any) => {
            (t.target as Circle).draw(this.ctx);
          });
        });
      },
    });
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
  }

  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.cW = window.innerWidth;
    this.cH = window.innerHeight;
    canvas.width = this.cW * devicePixelRatio;
    canvas.height = this.cH * devicePixelRatio;
    this.ctx.scale(devicePixelRatio, devicePixelRatio);
  }

  private nextColor() {
    this.colorIndex = this.colorIndex < this.colors.length - 1 ? this.colorIndex + 1 : 0;
    return this.colors[this.colorIndex];
  }
  private currentColor() {
    return this.colors[this.colorIndex];
  }

  private addClickListeners() {
    document.addEventListener('mousedown', (e) => this.handleEvent(e));
    document.addEventListener('touchstart', (e) => this.handleEvent(e));
  }

  private handleEvent(e: MouseEvent | TouchEvent) {
    const p = e instanceof TouchEvent ? e.touches[0] : e;
    const current = this.currentColor();
    const next = this.nextColor();
    const targetR = this.calcPageFillRadius(p.pageX, p.pageY);
    const rippleSize = Math.min(200, this.cW * 0.4);
    const minCoverDuration = 750;

    const pageFill = new Circle(p.pageX, p.pageY, 0, next);
    const fillAnim = anime({
      targets: pageFill,
      r: targetR,
      duration: Math.max(targetR / 2, minCoverDuration),
      easing: 'easeOutQuart',
      complete: () => {
        this.bgColor = next;
        this.removeAnimation(fillAnim);
      },
    });

    const ripple = new Circle(p.pageX, p.pageY, 0, current, true);
    const rippleAnim = anime({
      targets: ripple,
      r: rippleSize,
      opacity: 0,
      duration: 900,
      easing: 'easeOutExpo',
      complete: () => this.removeAnimation(rippleAnim),
    });

    const particles: Circle[] = [];
    for (let i = 0; i < 32; i++) {
      const particle = new Circle(p.pageX, p.pageY, anime.random(24, 48), current);
      particles.push(particle);
    }
    const particleAnim = anime({
      targets: particles,
      x: (c: Circle) => c.x + anime.random(-rippleSize, rippleSize),
      y: (c: Circle) => c.y + anime.random(-rippleSize * 1.15, rippleSize * 1.15),
      r: 0,
      easing: 'easeOutExpo',
      duration: () => anime.random(1000, 1300),
      complete: () => this.removeAnimation(particleAnim),
    });

    this.animations.push(fillAnim, rippleAnim, particleAnim);
  }

  private calcPageFillRadius(x: number, y: number) {
    const l = Math.max(x, this.cW - x);
    const h = Math.max(y, this.cH - y);
    return Math.sqrt(l * l + h * h);
  }

  private removeAnimation(anim: any) {
    const i = this.animations.indexOf(anim);
    if (i > -1) this.animations.splice(i, 1);
  }

  private startInactiveWatcher() {
    let timer = setTimeout(() => this.fakeClick(this.cW / 2, this.cH / 2), 2000);
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => this.fakeClick(this.cW / 2, this.cH / 2), 2000);
    };
    document.addEventListener('mousedown', reset);
    document.addEventListener('touchstart', reset);
  }

  private fakeClick(x: number, y: number) {
    const ev = new MouseEvent('mousedown', { clientX: x, clientY: y });
    Object.assign(ev, { pageX: x, pageY: y });
    document.dispatchEvent(ev);
  }
}

class Circle {
  opacity = 1;
  stroke?: { width: number; color: string };

  constructor(
    public x: number,
    public y: number,
    public r: number,
    public fill: string,
    stroked = false
  ) {
    if (stroked) this.stroke = { width: 3, color: fill };
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);

    if (this.stroke) {
      ctx.strokeStyle = this.stroke.color;
      ctx.lineWidth = this.stroke.width;
      ctx.stroke();
    } else {
      ctx.fillStyle = this.fill;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }
}
