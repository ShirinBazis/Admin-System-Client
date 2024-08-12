import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {PublishersContainerComponent} from "./components/publishers-container/publishers-container.component";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PublishersContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
