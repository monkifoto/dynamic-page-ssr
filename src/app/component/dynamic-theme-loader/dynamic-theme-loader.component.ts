import { Component, Input, ViewChild, ViewContainerRef, OnChanges, ComponentFactoryResolver, Type } from '@angular/core';
import { ThemeService } from 'src/app/services/theme-service.service';
import { HeroSliderComponent } from '../UI/hero-slider/hero-slider.component';
import { CenterTextComponent } from '../UI/center-text/center-text.component';
import { ItemListComponent } from '../UI/item-list/item-list.component';
import { WhyUsComponent } from '../UI/why-us/why-us.component';
import { FeaturesComponent } from '../UI/features/features.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { TestimonialCarouselComponent } from '../UI/testimonial-carousel/testimonial-carousel.component';
import { ConsultationComponent } from '../UI/consultation/consultation.component';
import { GoogleMapsComponent } from '../UI/google-maps/google-maps.component';
import { ComponentRef } from '@angular/core';

@Component({
    selector: 'app-theme-loader',
    template: `<div #themeContainer></div>`,
    styleUrls: ['./dynamic-theme-loader.component.css'],
    standalone: false
})
export class DynamicThemeLoaderComponent implements OnChanges {
  @Input() businessId: string = '';
  @ViewChild('themeContainer', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  constructor(private themeService: ThemeService) {}

  // Map theme types to component arrays
  private themeComponentsMap: { [key: string]: Type<any>[] } = {
    // 'hh': [
    //   { component: HeroSliderComponent, inputs: { navigation: 'bottom', sideButtons: true, sliderHeight: '70vh' } }, CenterTextComponent, ItemListComponent, WhyUsComponent, FeaturesComponent, TestimonialsComponent, TestimonialCarouselComponent],
    'demo': [HeroSliderComponent, CenterTextComponent, ItemListComponent, WhyUsComponent, FeaturesComponent, TestimonialsComponent],
    'ae': [HeroSliderComponent, CenterTextComponent, ItemListComponent, WhyUsComponent, FeaturesComponent, TestimonialsComponent],
    'clemo': [HeroSliderComponent, CenterTextComponent, ItemListComponent, WhyUsComponent, FeaturesComponent, TestimonialCarouselComponent, GoogleMapsComponent],
    'sb': [HeroSliderComponent, CenterTextComponent, ItemListComponent],
    'sp': [HeroSliderComponent, CenterTextComponent, ItemListComponent, WhyUsComponent, FeaturesComponent, TestimonialsComponent, ConsultationComponent, GoogleMapsComponent],
    'prestige': [HeroSliderComponent, CenterTextComponent, ItemListComponent, WhyUsComponent, FeaturesComponent, TestimonialsComponent, TestimonialCarouselComponent],
  };

  ngOnChanges(): void {
    if (this.businessId) {
      this.loadTheme();
    }
  }

  private loadTheme(): void {
    this.container.clear();

    this.themeService.getBusinessTheme(this.businessId).subscribe(themeData => {
      const themeType = themeData?.themeType || 'demo';
      const themeFile = themeData?.themeFileName || 'styles.css';

      // Apply the theme CSS
      this.themeService.applyThemeFile(themeFile).then(() => {
        console.log(`Theme applied: ${themeFile}`);
      });

      // Get the components for the given theme type
      const componentsToLoad = this.themeComponentsMap[themeType] || this.themeComponentsMap['demo'];

      // Dynamically create each component in the array
      componentsToLoad.forEach(component => {
        this.container.createComponent(component);
      });
    });
  }
}
