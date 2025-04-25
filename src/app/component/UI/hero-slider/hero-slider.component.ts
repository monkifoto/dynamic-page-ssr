import {
  Component, HostListener, Inject, Input, OnDestroy, OnInit, PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Business, SliderConfig } from '../../../model/business-questions.model';
import { BusinessDataService } from '../../../services/business-data.service';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';

@Component({
  selector: 'app-hero-slider',
  templateUrl: './hero-slider.component.html',
  styleUrls: ['./hero-slider.component.css'],
  animations: [
    trigger('slideFadeIn', [
      transition(':enter', [
        query('h1, h2, .clemo-separator', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(150, animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))),
        ]),
      ]),
    ]),
    trigger('slideTransition', [
      transition('* => enter', [
        style({ opacity: 0, transform: 'translateX({{directionEnter}})', position: 'absolute', top: 0, left: 0, width: '100%' }),
        animate('1200ms ease', style({ opacity: 1, transform: 'translateX(0)' }))
      ], { params: { directionEnter: '100%' } }),
      transition('* => leave', [
        style({ position: 'absolute', top: 0, left: 0, width: '100%' }),
        animate('1200ms ease', style({ opacity: 0, transform: 'translateX({{directionLeave}})' }))
      ], { params: { directionLeave: '-100%' } }),
      transition(':leave', [
        animate('1200ms ease', style({ opacity: 0 }))
      ])
    ])
  ],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HeroSliderComponent implements OnInit, OnDestroy {
  isBrowser = false;
  business: Business | null = null;
  slides: any[] = [];
  currentSlide = 0;
  sliderOpacity = 1;
  enableTransitions = false;
  intervalId: any;

  @Input() navigation: 'side' | 'bottom' = 'side';
  @Input() sideButtons = true;
  @Input() sliderHeight = '100vh';
  @Input() buttonBorderRadius = '25px';
  @Input() subtitleSize = '1.5rem';
  @Input() subtitleWeight = '1.5rem';

  slideDirection: 'left' | 'right' = 'left';
  previousSlide = 0;
  isTransitioning = false;

  constructor(
    private router: Router,
    private businessDataService: BusinessDataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      setTimeout(() => this.enableTransitions = true, 50);
      this.autoSlide();
    }

   // console.log('HeroSliderComponent - ngOnInit');
    this.fetchHeroSliderData();
  }

  fetchHeroSliderData(): void {
    this.businessDataService.businessData$.subscribe((data) => {
      if (data) {
        this.business = data;

        if (this.business.heroSlider && Array.isArray(this.business.heroSlider)) {
          this.slides = this.business.heroSlider.map((slide: any) => ({
            title: this.replaceKeywords(slide.title),
            subtitle: this.replaceKeywords(slide.subtitle),
            backgroundImage: slide.backgroundImage,
            buttons: slide.buttons || []
          }));
        //  console.log("slide count:", this.slides.length);
        } else {
          console.warn('HeroSliderComponent - No heroSlider data available.');
          this.slides = [];
        }

        if (this.business.sliderConfig) {
          this.applySliderConfig(this.business.sliderConfig);
        } else {
         // console.warn('HeroSliderComponent - No sliderConfig found, using default values.');
        }
      } else {
       // console.error('HeroSliderComponent - No business data available.');
      }
    });
  }

  applySliderConfig(config: SliderConfig): void {
    this.navigation = config.navigation ?? 'side';
    this.sideButtons = config.sideButtons ?? true;
    this.sliderHeight = config.sliderHeight ?? '100vh';
    this.buttonBorderRadius = config.buttonBorderRadius ?? '25px';
    this.subtitleSize = config.subtitleSize ?? '1.5rem';
    this.subtitleWeight = config.subtitleWeight ?? '600';

   // console.log('HeroSliderComponent - Applied slider config:', config);
  }

  replaceKeywords(text: string): string {
    if (!text || !this.business?.businessName) return text;
    return text.replace(/{{businessName}}/g, this.business.businessName);
  }

  autoSlide(): void {
    if (this.isBrowser && this.slides?.length > 1) {
      this.intervalId = setInterval(() => {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
      }, 15000);
    }
  }

  navigateToSlide(index: number): void {
    if (this.isTransitioning || index === this.currentSlide) return;
    this.slideDirection = index > this.currentSlide ? 'left' : 'right';
    this.previousSlide = this.currentSlide;
    this.currentSlide = index;
    this.isTransitioning = true;
  //console.log('HeroSliderComponent - navigateToSlide:', index);
  }

  prevSlide(): void {
    if (this.isTransitioning) return;
    this.slideDirection = 'right';
    this.previousSlide = this.currentSlide;
    this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
    this.isTransitioning = true;
  }

  nextSlide(): void {
    if (this.isTransitioning) return;
    this.slideDirection = 'left';
    this.previousSlide = this.currentSlide;
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.isTransitioning = true;
  }

  onSlideTransitionDone(i: number): void {
    if (i === this.previousSlide) {
      this.previousSlide = -1;
    }
    this.isTransitioning = false;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (!this.isBrowser) return;
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    this.sliderOpacity = Math.max(1 - scrollY / viewportHeight, 0);
  }

  ngOnDestroy(): void {
    if (this.isBrowser && this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
