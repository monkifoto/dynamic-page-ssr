import { Component } from '@angular/core';

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.css'],
    standalone: false
})
export class FaqComponent {
  faqs = [
    {
      question: 'What services do you provide?',
      answer: 'We offer 24/7 care, medication management, meal preparation, assistance with daily activities, and specialized care for conditions like dementia or mobility limitations.',
      open: false
    },
    {
      question: 'How do I know if an Adult Family Home is right for my loved one?',
      answer: 'If your loved one needs assistance with daily living but still wants a home-like setting with personalized care, an AFH can be a great alternative to larger nursing facilities.',
      open: false
    },
    {
      question: 'Do you provide specialized care for dementia or Alzheimer’s patients?',
      answer: 'Yes, we offer memory care services tailored to the needs of residents with dementia, including safety measures, cognitive activities, and compassionate support.',
      open: false
    },
    {
      question: 'What are the room and living arrangements?',
      answer: 'We provide private or semi-private rooms in a warm, family-like setting. Our common areas encourage socialization, and residents receive personalized attention.',
      open: false
    },
    {
      question: 'Can family members visit?',
      answer: 'Absolutely! We encourage family visits and open communication. Visiting hours may vary, but we strive to accommodate family involvement.',
      open: false
    },
    {
      question: 'What is the cost of care, and do you accept insurance?',
      answer: 'Pricing depends on the level of care needed. We accept private pay and some long-term care insurance plans. Contact us for a personalized quote.',
      open: false
    },
    {
      question: 'What activities and social programs do you offer?',
      answer: 'We provide daily activities such as games, music, gentle exercises, and social events to keep residents engaged and active.',
      open: false
    },
    {
      question: 'How do I schedule a tour or get more information?',
      answer: 'You can contact us through our website, call us directly, or fill out our inquiry form to schedule a visit and learn more about our care services.',
      open: false
    }
  ];
}
