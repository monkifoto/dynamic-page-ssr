import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./component/footer/footer.component";
import { NavigationComponent } from "./component/navigation/navigation.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dynamic-page-ssr';
}
