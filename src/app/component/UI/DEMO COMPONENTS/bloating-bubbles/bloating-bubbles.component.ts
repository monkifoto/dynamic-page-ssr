import { Component, ViewEncapsulation, OnInit , OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';

interface Bubble {
  left: string;
  top: string;
  size: string;
  color: string;
  animationDuration: string;
  animationDirection: string;
}

@Component({
  selector: 'app-bloating-bubbles',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  // imports: [CommonModule],
  templateUrl: './bloating-bubbles.component.html',
  styleUrls: ['./bloating-bubbles.component.css'],
})

export class BloatingBubblesComponent implements OnInit, OnDestroy {
  bubbles: Bubble[] = []; // Use the Bubble interface
  overlayText: string = ''; // Property to hold the current overlay text
  private textIndex: number = 0; // Index for the current text
  private texts: string[] = [
    'Welcome to the Bloating Bubbles',
    'Enjoy the floating experience!',
    'Watch the bubbles dance!',
    'Feel the serenity of the bubbles!',
    'Bubbles are fun and relaxing!',
  ]; // Array of texts
  currentTextIndex: number = 0;
  private intervalId: any; // Variable to hold the interval ID

  constructor() {
     this.generateBubbles(25); // Generate 50 bubbles
  }

  ngOnInit(): void {
    console.log('ngOnInit started');

    this.overlayText = this.texts[this.currentTextIndex]; // Initialize with the first text
    this.startRotatingText();
    console.log('ngOnInit ended');

  }

  startRotatingText(): void {
     this.intervalId = setInterval(() => {
       this.updateText();
      console.log(this.overlayText); // Log the current text to the console
      console.log(this.currentTextIndex); // Log the current index to the console
     }, 5000); // Update every 5 seconds
  }


  ngOnDestroy(): void {
    this.stopRotatingText();
  }

  updateText(): void {
    this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length; // Cycle through the array
    this.overlayText = this.texts[this.currentTextIndex];
  }

  stopRotatingText(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  generateBubbles(count: number) {
    for (let i = 0; i < count; i++) {
      const left = Math.random() * 100; // Random left position (0% to 100%)
      const top = Math.random() * 100; // Random top position (0% to 100%)
      const duration = Math.random() * 5 + 5; // Random duration (5s to 10s)
      const directionX = Math.random() < 0.5 ? 'left' : 'right'; // Random horizontal direction
      const directionY = Math.random() < 0.5 ? 'up' : 'down'; // Random vertical direction
      const size = Math.random() * 30 + 20; // Random size between 20px and 50px
      const color = this.getRandomColor();

      this.bubbles.push({
        left: `${left}vw`,
        top: `${top}vh`,
        size: `${size}px`, // Set the size
        animationDuration: `${duration}s`,
        animationDirection: `${directionX}-${directionY}`, // Combine directions
        color: color, // Set the color
      });
    }
  }

  getRandomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`; // Return the color in RGB format
  }
}
