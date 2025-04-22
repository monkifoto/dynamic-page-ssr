import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { PageHero } from 'src/app/model/business-questions.model';

@Component({
    selector: 'app-hero',
    templateUrl: './hero.component.html',
    styleUrls: ['./hero.component.css'],
    standalone: false
})
export class HeroComponent implements OnInit {
  @Input() layoutType: string = 'hh';
  backgroundImage: string = '';
  message: string = '';

  private fallbackImages: { [key: string]: { image: string; message: string } } = {
    'services': {
      image: 'assets/sharedAssets/istockphoto-1344063915-2048x2048.jpg',
      message: 'Discover our Services'
    },
    'gallery': {
      image: 'assets/sharedAssets/istockphoto-1551967154-2048x2048.jpg',
      message: 'Explore our Gallery'
    },
    'about-us': {
      image: 'assets/sharedAssets/istockphoto-1162510523-2048x2048.jpg',
      message: 'Learn About Us'
    },
    'contact-us': {
      image: 'assets/sharedAssets/istockphoto-1066099806-2048x2048.jpg',
      message: 'Get in Touch'
    },
    'testimonials': {
      image: 'assets/sharedAssets/istockphoto-653191338-2048x2048.jpg',
      message: 'What they say about us'
    },
    'resident-form': {
      image: 'assets/sharedAssets/istockphoto-1453597643-2048x2048.jpg',
      message: 'Let us make you feel at home'
    },
    'location': {
      image: 'assets/sharedAssets/istockphoto-1344063915-2048x2048.jpg',
      message: 'Come Meet Us'
    }
  };

  constructor(
    private router: Router,
    private businessDataService: BusinessDataService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const page = this.router.url.split('?')[0].replace('/', '');
        this.loadHeroForPage(page);
      });

    // Initial load
    const initialPage = this.router.url.split('?')[0].replace('/', '');
    this.loadHeroForPage(initialPage);
  }

  private loadHeroForPage(page: string): void {
    this.businessDataService.getPageHeros().subscribe((heroes) => {
      console.log('Page Heroes:', heroes);
      console.log('Current Page:', page);

      const activeHeroes = heroes.filter((hero) => hero.isActive);
      const matchedHero = activeHeroes.find((hero) => hero.page === page);

      if (matchedHero) {
        this.backgroundImage = `url(${matchedHero.imageUrl})`;
        this.message = matchedHero.message || 'Welcome';
      } else if (this.fallbackImages[page]) {
        this.backgroundImage = `url(${this.fallbackImages[page].image})`;
        this.message = this.fallbackImages[page].message;
      } else {
        this.backgroundImage = 'url(assets/sharedAssets/default-hero.jpg)';
        this.message = 'Welcome';
      }
    });
  }
}
