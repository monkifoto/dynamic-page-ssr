import { Location } from '@angular/common';
import { Section } from './section.model';

export interface Business {
  businessData: {};
  // [x: string]: {};
  id: string;

  //Business Information
  businessName: string;
  providerName: string;
  tagline: string;
  address: string;
  phone: string;
  fax: string;
  email: string;
  businessURL: string;
  logoImage: string;
  faviconUrl: string;
  keyWords: string;
  placeId: string;
  isActive: boolean;
  isLive: boolean;
  businessHours: string;
  socialMedia: string;


  // Hero Slider
  heroSlider: HeroSlide[];
  pageHeroes: PageHero[];
  sliderConfig?: SliderConfig;
  heroImages: string[];
  sections: Section[];
  activeBusinessId: string;
  // services: ListItem[];
  testimonials: Testimonial[];
  // benefits: ListItem[];
  uniqueService: ListItem[];
  whyChoose: ListItem[];
  employees: Employee[];
  locations: BusinessLocation[];

//to be removed
   certifications: string;
  //Contact us page
  contactFormDetails: string;
  contactUsImageUrl: string;
  faqs: string;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  metaImage: string;
  theme: Theme;
}

export interface BusinessLocation{
locationName:string;
  street:string;
  city:string;
  state:string;
  zipcode: string;
  phone:string;
  fax:string;
  email:string;
  image:string;
  businessHours:string;

}

export interface HeroSlide {
  title: string; // Title for the slide
  subtitle: string; // Subtitle for the slide
  backgroundImage: string; // URL for the slide's background image
  buttons: HeroButton[]; // Array of buttons for the slide
}
export interface SliderConfig {
  navigation: 'side' | 'bottom';
  sideButtons: boolean;
  sliderHeight: string;
  buttonBorderRadius: string;
  subtitleSize: string;
  subtitleWeight: string;
}

export interface PageHero {
  id?: string;
  businessId: string;
  page: string; // e.g. 'about-us', 'services'
  imageUrl: string;
  message: string;
  isActive?: boolean;
  order?: number;
}


export interface HeroButton {
  text: string; // Button text
  link: string; // URL the button links to
  outline: boolean; // Whether the button has an outline style
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoURL: string;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  relationship: string;
  photoURL: string;
}

export interface ListItem {
  icon?: string;
  name: string;
  description: string;
}

export interface HeroImage {
  url: string;
  altText?: string; // Optional field for image alt text
}

export interface Theme {
  themeFileName?: string;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  accentColor: string;
  darkBackgroundColor: string;
  navTextColor: string;
  navBackgroundColor: string;
  navActiveBackground: string;
  navActiveText: string;
  buttonColor: string;
  buttonHoverColor: string;

  themeType?: string;
}

export class BusinessModel {
  static getDefaultBusiness(): Business {
    return {
      sections: [
        {
          id: '',
          order: 1,
          page: 'home',
          location: 'top',
          component: 'center-text',


          sectionTitle: 'A Home of Exceptional Care',
          titleFontSize: 56,
          titleFontStyle: 'normal',
          titleColor: 'var(--text-color)',

          sectionSubTitle: 'We are #1 Helping Hand AFH',
          subtitleFontSize: 26,
          subtitleColor: 'var(--accent-color)',
          subtitleFontStyle: 'normal',

          textFontSize: 18,
          textFontStyle: 'normal',

          alignText: 'center',
          textColor: 'var(--text-color)',
          sectionContent: 'After 10 years of working in the Senior Living and Senior Care industry, #1 Helping Hand AFH was founded in June 2021 with a heartfelt commitment to providing a warm, caring environment for your loved ones. Our mission began with the desire to create a home where seniors can relax, feel loved, and truly enjoy their golden years to the fullest.',
          backgroundColor: 'var(--background-color)',

          items: [],

          showButton: true,
          boxShadow: false,
          buttonText: 'Contact Us',
          buttonLink: 'contact-us',

          borderRadius: 10,
          fullWidth: true,
          isParallax: false,
          isMinimal: false,


          sectionImageUrl: '',
          showImage: '',
          isActive: true,
          paddingTop: 80,
          paddingBottom: 80,
          paddingLeft: 0,
          paddingRight: 0,
          contentPadding: 20,
        },
        {
          id:'',
          isActive: true,
          page:'home',
          location:'bottom',
          component:'consultation',
          sectionTitle: 'Ready to Experience {{businessName}}',
          sectionSubTitle: 'Come See the difference.',
          sectionContent:
            'Founded by healthcare professionals passionate about senior care, Careful Living AFH aims to provide a nurturing environment for the elderly.',
          order:5,
          items: [],
          isMinimal:false,
          isParallax:false,
          backgroundColor: 'var(--background-color)' ,
          textColor: 'var(--text-color)',
          textFontSize: 18,
          textFontStyle: 'normal',
          titleColor: 'var(--accent-color)',
          subtitleColor: 'var(--secondary-color)',
          fullWidth: true,
          showButton: true,
          buttonText: 'Learn More',
          buttonLink:  'contact-us',
          alignText:  'left',
          boxShadow: false,
          borderRadius:  0,
          paddingTop: 80,
          paddingBottom: 80,
          paddingLeft: 0,
          paddingRight: 0,
          contentPadding: 20,

        },
        {
          id:'',
          isActive: true,
          page:'aboutus',
          location:'right',
          component:'right-text',
          sectionTitle: 'Our Story',
          sectionSubTitle: 'Caring with compassion for every senior.',
          sectionContent:
            'Founded by healthcare professionals passionate about senior care, Careful Living AFH aims to provide a nurturing environment for the elderly.',
          order:0,
          items: [],
          isMinimal:false,
          isParallax:false,
          backgroundColor: 'var(--background-color)' ,
          textFontSize: 18,
          textFontStyle: 'normal',
          textColor: 'var(--text-color)',
          titleColor: 'var(--accent-color)',
          subtitleColor: 'var(--secondary-color)',
          fullWidth:false,
          showButton: false,
          buttonText: 'Learn More',
          buttonLink:  'contact-us',
          alignText:  'left',
          boxShadow: false,
          borderRadius:  0,
          paddingTop: 80,
          paddingBottom: 80,
          paddingLeft: 0,
          paddingRight: 0,
          contentPadding: 20,
          sectionImageUrl: 'http://localhost:4200/assets/sharedAssets/istockphoto-1162510523-2048x2048.jpg',
          showImage: 'null',
        },
        {
          id:'',
          isActive: true,
          page:'aboutus',
          location:'left',
          component:'left-text',
          sectionTitle: 'Our Vision',
          sectionSubTitle: 'Caring with compassion for every senior.',
          sectionContent:
            'Founded by healthcare professionals passionate about senior care, Careful Living AFH aims to provide a nurturing environment for the elderly.',
          order:0,
          items: [],
          isMinimal:false,
          isParallax:false,
          backgroundColor: 'var(--background-color)' ,
          textFontSize: 18,
          textFontStyle: 'normal',
          textColor: 'var(--text-color)',
          titleColor: 'var(--accent-color)',
          subtitleColor: 'var(--secondary-color)',
          fullWidth:false,
          showButton: false,
          buttonText: 'Learn More',
          buttonLink:  'contact-us',
          alignText:  'left',
          boxShadow: false,
          borderRadius:  0,
          paddingTop: 80,
          paddingBottom: 80,
          paddingLeft: 0,
          paddingRight: 0,
          contentPadding: 20,
          sectionImageUrl: 'http://localhost:4200/assets/sharedAssets/istockphoto-1162510523-2048x2048.jpg',
          showImage: 'null',
        },
        {
          id:'',
          isActive: true,
          page:'services',
          location:'right',
          component:'right-text',
          sectionTitle: 'Our Mission',
          sectionSubTitle: 'Caring with compassion for every senior.',
          sectionContent:
            'Founded by healthcare professionals passionate about senior care, Careful Living AFH aims to provide a nurturing environment for the elderly.',
          order:0,
          items: [],
          isMinimal:false,
          isParallax:false,
          backgroundColor: 'var(--background-color)' ,
          textColor: 'var(--text-color)',
          textFontSize: 18,
          textFontStyle: 'normal',
          titleColor: 'var(--accent-color)',
          subtitleColor: 'var(--secondary-color)',
          fullWidth:false,
          showButton: false,
          buttonText: 'Learn More',
          buttonLink:  'contact-us',
          alignText:  'left',
          boxShadow: false,
          borderRadius:  0,
          paddingTop: 80,
          paddingBottom: 80,
          paddingLeft: 0,
          paddingRight: 0,
          contentPadding: 20,
          sectionImageUrl: 'http://localhost:4200/assets/sharedAssets/istockphoto-1162510523-2048x2048.jpg',
          showImage: 'null',
        },
        {
          id:'',
          isActive: true,
          page:'services',
          location:'left',
          component:'left-text',
          sectionTitle: 'Our Motivation',
          sectionSubTitle: 'Caring with compassion for every senior.',
          sectionContent:
            'Founded by healthcare professionals passionate about senior care, Careful Living AFH aims to provide a nurturing environment for the elderly.',
          order:0,
          items: [],
          isMinimal:false,
          isParallax:false,
          backgroundColor: 'var(--background-color)' ,
          textFontSize: 18,
          textFontStyle: 'normal',
          textColor: 'var(--text-color)',
          titleColor: 'var(--accent-color)',
          subtitleColor: 'var(--secondary-color)',
          fullWidth:false,
          showButton: false,
          buttonText: 'Learn More',
          buttonLink:  'contact-us',
          alignText:  'left',
          boxShadow: false,
          borderRadius:  0,
          paddingTop: 80,
          paddingBottom: 80,
          paddingLeft: 0,
          paddingRight: 0,
          contentPadding: 20,
          sectionImageUrl: 'http://localhost:4200/assets/sharedAssets/istockphoto-1162510523-2048x2048.jpg',
          showImage: 'null',
        },
        {
          id:'',
          isActive: true,
          page:'gallery',
          location:'top',
          component:'center-text',
          sectionTitle: 'OurHome',
          sectionSubTitle: 'Welcome to our gallery',
          sectionContent:
            'Gallery Text',
          order:0,
          items: [],
          isMinimal:false,
          isParallax:false,
          backgroundColor: 'var(--background-color)' ,
          textColor: 'var(--text-color)',
          textFontSize: 18,
          textFontStyle: 'normal',
          titleColor: 'var(--accent-color)',
          subtitleColor: 'var(--secondary-color)',
          fullWidth:false,
          showButton: false,
          buttonText: 'Learn More',
          buttonLink:  'contact-us',
          alignText:  'left',
          boxShadow: false,
          borderRadius:  0,
          paddingTop: 80,
          paddingBottom: 80,
          paddingLeft: 0,
          paddingRight: 0,
          contentPadding: 20,
        },
      ],
      activeBusinessId:'',
      heroImages: [''],
      heroSlider: [
        {
          title: 'Welcome to Careful Living AFH',
          subtitle: 'Caring with compassion for every senior.',
          backgroundImage: '../../assets/sharedAssets/istockphoto-1022730404-2048x2048.jpg',
          buttons: [
            {
              text: 'Learn More',
              link: '/about',
              outline: false,
            },
            {
              text: 'Contact Us',
              link: '/contact',
              outline: true,
            },
          ],
        },
        {
          title: 'Welcome to Careful Living AFH',
          subtitle: 'Caring with compassion for every senior.',
          backgroundImage: '../../assets/sharedAssets/istockphoto-1022730404-2048x2048.jpg',
          buttons: [
            {
              text: 'Schedule A Visti',
              link: '/contact-us',
              outline: false,
            },

          ],
        },
        {
          title: 'Exceptional Senior Care',
          subtitle: 'Personalized, compassionate, and dedicated.',
          backgroundImage: '../../assets/sharedAssets/istockphoto-1319783351-2048x2048.jpg',
          buttons: [
            {
              text: 'Our Services',
              link: '/services',
              outline: false,
            },
          ],
        },
      ],
      pageHeroes:[{
        id: '',
        businessId: '',
        page: 'home',
        imageUrl: '../../assets/sharedAssets/istockphoto-1022730404-2048x2048.jpg',
        message: 'Welcome to Careful Living AFH',
        isActive: true,
        order: 1,
      },
      {
        id: '',
        businessId: '',
        page: 'about-us',
        imageUrl: '../../assets/sharedAssets/istockphoto-1022730404-2048x2048.jpg',
        message: 'Learn About Us',
        isActive: true,
        order: 2,
      },
      {
        id: '',
        businessId: '',
        page: 'services',
        imageUrl: '../../assets/sharedAssets/istockphoto-1022730404-2048x2048.jpg',
        message: 'Discover Our Services',
        isActive: true,
        order: 3,
      },
      {
        id: '',
        businessId: '',
        page: 'gallery',
        imageUrl: '../../assets/sharedAssets/istockphoto-1022730404-2048x2048.jpg',
        message: 'Explore Our Gallery',
        isActive: true,
        order: 4,
      },
      {
        id:'',
          businessId:'',
          page:'contact-us',
          imageUrl:'../../assets/sharedAssets/istockphoto-1022730404-2048x2048.jpg',
          message:'Get in Touch',
          isActive:true,
          order:5
      }],
      businessData: '',
      id: '',
      faqs: '',

      businessName: 'Careful Living AFH',
      keyWords: 'Adult Family Home Bellevue, Senior Care Bellevue WA, Elderly Care Services Bellevue, Assisted Living Bellevue Washington, Memory Care Bellevue, Dementia Care Bellevue WA, Respite Care Bellevue, Long-Term Care Bellevue, Home Care for Seniors Bellevue,Skilled Nursing Bellevue WA,Personalized Senior Care Bellevue, Senior Living Bellevue Washington, Compassionate Elderly Care Bellevue, Family Home Care Bellevue WA, Professional Senior Care Services Bellevue, Senior Assisted Living Bellevue, Senior Home Assistance Bellevue WA, Senior Housing Bellevue Washington, Helping Hand AFH Bellevue, Senior Caregivers Bellevue WA',
      businessURL: 'https://www.carefullivingafh.com',
      providerName: 'Sarah Caregiver',
      tagline: 'Caring with compassion for every senior',

      certifications:
        'State Licensed, Certified Nursing Assistants (CNA), First Aid/CPR Certified',

      logoImage: '../assets/sharedAssets/Demologo2.png',
      faviconUrl: '../../assets/sharedAssets/icons/hh_favicon.ico',

      locations:[
        {
          locationName:'Location 1',
          street: '4567 Compassionate Ln,',
          city:' Kindness City',
          state:'ST',
          zipcode:'56789',
          phone:'(987) 654-3210',
          fax: '(987) 654-3211',
          email: 'contact@carefullivingafh.com',
          image: '',
          businessHours: ''
        }
      ],
      address: '',
      phone: '4253904204',
      fax: '4253904204',
      email: 'toxicsanity@gmail.com',

      businessHours: 'Mon-Fri: 8am-6pm, Sat-Sun: 9am-5pm',
      socialMedia:
        'Facebook: facebook.com/carefullivingafh; Instagram: instagram.com/carefullivingafh',

      contactFormDetails:
        'Please provide name, email, phone number, and message for inquiries.',
      contactUsImageUrl: '',

      isActive: true,
      isLive: false,
      placeId: '',
      uniqueService: [
        {
          description:
            'Residents receive customized care plans that adapt to their specific health conditions, preferences, and evolving needs.',
          name: 'Personalized Care',
        },
        {
          name: 'Homelike Environment',
          description:
            'We offer private rooms and shared common living spaces, such as kitchens, dining rooms, and living areas, providing a cozy, familiar atmosphere.',
        },
        // Other unique services...
      ],
      whyChoose: [
        {
          name: 'One-on-One Care',
          description:
            'Our caregivers truly get to know each resident’s needs, preferences, and routines, ensuring tailored care and a personal connection.',
        },
        // Other reasons...
      ],
      // services: [
      //   { name: 'Medication & Health Management', icon: 'fa-solid fa-prescription-bottle', description: 'Proper medication administration, doctor visits, lab work, and therapy to maintain well-being.' },
      //   { name: '24/7 Assistance & Health Monitoring', icon: 'fa-solid fa-bed-pulse', description: 'Around-the-clock care, including vital signs monitoring and professional nursing support.' },
      //   { name: 'Daily Living & Personal Care', icon: 'fa-solid fa-shower', description: 'Assistance with bathing, dressing, grooming, mobility, and incontinence support.' },
      //   { name: 'Nutritious Meals & Special Diets', icon: 'fa-solid fa-utensils', description: 'Thoughtfully planned meals tailored to dietary and medical needs.' },
      //   { name: 'Engaging Activities & Entertainment', icon: 'fa-solid fa-compact-disc', description: 'Personalized activities, social programs, and entertainment for enrichment and connection.' },
      //   { name: 'Comfortable & Accessible Living', icon: 'fa-solid fa-wheelchair', description: 'Housekeeping, wheelchair accessibility, and a clean, safe environment.' },
      //   // Other services...
      // ],
      // benefits: [
      //   { name: 'Private & Accessible Rooms', icon: 'fa-solid fa-lock', description: 'Private rooms with optional shared bathrooms, equipped with a calling system, phone, cable TV, and high-speed wireless internet.' },
      //   { name: 'Safe & Secure Environment', icon: 'fa-brands fa-accessible-icon', description: 'Handicap-accessible design, smoke alarms, a security system, emergency call buttons, and an electric generator for backup power.' },
      //   { name: 'Spacious & Inviting Common Areas', icon: 'fa-solid fa-expand', description: 'Open floor plan with high ceilings, hardwood floors, and a covered deck for relaxation.' },
      //   { name: 'Engaging Activities & Social Events', icon: 'fa-solid fa-compact-disc', description: 'Music and audiobook therapy, card and board games, knitting, word searches, puzzles, crafts, movie nights, and birthday celebrations.' },
      //   // Other benefits...
      // ],
      testimonials: [
        {
          id: '',
          name: 'Sarah Thompson',
          quote:
            'Finding this Adult Family Home for my mother was the best decision we ever made.',
          relationship: 'mother',
          photoURL: '',
        },
        // Other testimonials...
      ],
      employees: [
        {
          name: 'Alex',
          photoURL: '../assets/employees/alex.jpg',
          id: '',
          bio: '17 years as a software engineer and 10 years as a professional photographer',
          role: 'Programmer/Designer',
        },
        // Other employees...
      ],
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      metaImage: '',
      theme: {
        themeFileName: 'prestige.css',
        primaryColor: '#fffaf2',
        secondaryColor: '#f8f3f0',
        accentColor: '#F0C987',
        backgroundColor: '#F5F3E7',
        darkBackgroundColor: '#4C6A56',
        textColor: '#2F2F2F',
        navBackgroundColor: '#F5F3E7',
        navTextColor: '#33372C',
        navActiveBackground: '#33372C',
        navActiveText: '#ffffff',
        buttonColor: '#D9A064',
        buttonHoverColor: '#c9605b',
        themeType: 'prestige',
      },
    };
  }
}
