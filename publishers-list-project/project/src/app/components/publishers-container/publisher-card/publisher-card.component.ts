import {Component, Input} from '@angular/core';
import {Publisher} from "../publishers-container.component";
import {DomainCardComponent} from "../domain-card/domain-card.component";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-publisher-card',
  standalone: true,
  imports: [
    DomainCardComponent,
    CommonModule
  ],
  templateUrl: './publisher-card.component.html',
  styleUrl: './publisher-card.component.css'
})
export class PublisherCardComponent {
  @Input() publisher!: Publisher;
  @Input() domainsMap!: { [key: string]: string };

  constructor() {
  }
}
