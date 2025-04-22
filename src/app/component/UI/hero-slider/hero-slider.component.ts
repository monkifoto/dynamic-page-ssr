import { Component, HostListener, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Business, SliderConfig } from 'src/app/model/business-questions.model';
import { BusinessDataService } from 'src/app/services/business-data.service';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  group,
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
            ], { params: { directionLeave: '-100%' } })
        ])
    ],
    standalone: false
})
export class HeroSliderComponent implements OnInit ,OnDestroy {
  isBrowser: boolean = false;
  business: Business | null = null;
  slides: any[] = [];
  @Input() navigation: 'side' | 'bottom' = 'side';  // Default: side navigation
  @Input() sideButtons: boolean = true;  // Default: show side buttons
  @Input() sliderHeight: string = '100vh'; // Default height is 100vh
  @Input() buttonBorderRadius: string = '25px'; // Default border radius
  @Input() subtitleSize: string = '1.5rem'; // Default subtitle size
  @Input() subtitleWeight: string = '1.5rem'; // Default subtitle size

  currentSlide = 0;
  sliderOpacity = 1; // Initial opacity for the slider
  enableTransitions = true;

  constructor(
    private router: Router,
    private businessDataService: BusinessDataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    setTimeout(() => this.enableTransitions = true, 50);
    console.log('HeroSliderComponent - ngOnInit');
    this.fetchHeroSliderData();

    if (this.isBrowser) {
      this.autoSlide();
    }
  }

  fetchHeroSliderData(): void {
    this.businessDataService.businessData$.subscribe((data) => {
      if (data) {
        //console.log('HeroSliderComponent - Retrieved business data:', data);
        this.business = data;

        // Load slides
        if (this.business.heroSlider && Array.isArray(this.business.heroSlider)) {
          this.slides = this.business.heroSlider.map((slide: any) => ({
            title: this.replaceKeywords(slide.title),
            subtitle: this.replaceKeywords(slide.subtitle),
            backgroundImage: slide.backgroundImage,
            buttons: slide.buttons || []
          }));
          console.log("slide count:", this.slides.length);
        } else {
          console.warn('HeroSliderComponent - No heroSlider data available.');
          this.slides = [];
        }

        // Load slider configuration if available
        if (this.business.sliderConfig) {
          this.applySliderConfig(this.business.sliderConfig);
        } else {
          console.warn('HeroSliderComponent - No sliderConfig found, using default values.');
        }
      } else {
        console.error('HeroSliderComponent - No business data available.');
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

    console.log('HeroSliderComponent - Applied slider config:', config);
  }
  replaceKeywords(text: string): string {
    if (!text || !this.business?.businessName) {
      return text;
    }
    return text.replace(/{{businessName}}/g, this.business.businessName);
  }

  // navigateToSlide(index: number): void {
  //   this.currentSlide = index;
  // }
  private intervalId: any;
  autoSlide(): void {
    this.intervalId = setInterval(() => {
      if (this.slides?.length > 1) {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
      }
    }, 15000);
  }

  slideDirection: 'left' | 'right' = 'left';
  previousSlide = 0;
  isTransitioning = false;

  navigateToSlide(index: number): void {
    if (this.isTransitioning || index === this.currentSlide) return;
    this.slideDirection = index > this.currentSlide ? 'left' : 'right';
    this.previousSlide = this.currentSlide;
    this.currentSlide = index;
    this.isTransitioning = true;
    console.log('HeroSliderComponent - navigateToSlide:', index);
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

  // Scroll event listener to adjust opacity
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (!this.isBrowser) return;
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    this.sliderOpacity = Math.max(1 - scrollY / viewportHeight, 0);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
