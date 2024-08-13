import { Component, OnInit } from '@angular/core';
import { PublisherCardComponent } from "./publisher-card/publisher-card.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { ConnectToServer } from '../../connect-to-server.component';

export type Publisher = {
  publisher: string;
  domains: Array<Domain>
};

export type Domain = {
  domain: string,
  desktopAds: number,
  mobileAds: number
};

@Component({
  selector: 'app-publishers-container',
  standalone: true,
  imports: [
    PublisherCardComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './publishers-container.component.html',
  styleUrl: './publishers-container.component.css'
})

export class PublishersContainerComponent implements OnInit {
  newPublisherName: string = '';
  newDomain: string = '';
  newDesktopAds: string = '';
  newMobileAds: string = '';
  isAddingPublisher: boolean = false;
  isAddingDomain: boolean = false;
  selectedPublisher: Publisher | null = null;
  // A domain doesn't start or end with a hyphen, each label has 1-63 characters (except for the last that is minimum 2) and a a second-label is optionally
  domainPattern: RegExp = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.(?:[A-Za-z0-9-]{1,63}(?<!-)\.)?[A-Za-z]{2,63}$/;
  isDomainValid: boolean = true;
  isDesktopAdsValid: boolean = true;
  isMobileAdsValid: boolean = true;
  isPublisherExists: boolean = false;
  isDomainExists: boolean = false;
  domainExistsMessage: string = '';
  data: Publisher[] = [];

  constructor(private connectToServer: ConnectToServer) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.connectToServer.fetchData().subscribe({
      next: (response) => {
        this.data = response;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  toggleAddPublisher() {
    this.isAddingPublisher = !this.isAddingPublisher;
  }

  // After a "publisher exists" message, make it disappear when changing the input again
  validatePublisher() {
    this.isPublisherExists = false;
  }

  addPublisher() {
    if (this.newPublisherName.trim()) {
      const publisherData = {
        publisher: this.newPublisherName.trim(),
        domains: []
      };
      this.connectToServer.addPublisher(publisherData).subscribe({
        next: () => {
          // Update the data and reset
          this.fetchData();
          this.isPublisherExists = false;
          this.newPublisherName = '';
          this.toggleAddPublisher();
        },
        error: (error) => {
          if (error.status === 409) {
            this.isPublisherExists = true;
          } else {
            console.error('Error adding publisher:', error);
          }
        }
      });
    }
  }

  cancelAddPublisher() {
    this.newPublisherName = '';
    this.isPublisherExists = false;
    this.toggleAddPublisher();
  }

  toggleAddDomain() {
    this.isAddingDomain = !this.isAddingDomain;
  }

  validateDomain() {
    this.isDomainValid = this.domainPattern.test(this.newDomain.trim());
    this.isDomainExists = false;
  }

  validateDesktopAds() {
    this.isDesktopAdsValid = Number.isInteger(parseInt(this.newDesktopAds)) && parseInt(this.newDesktopAds) >= 0;
  }

  validateMobileAds() {
    this.isMobileAdsValid = Number.isInteger(parseInt(this.newMobileAds)) && parseInt(this.newMobileAds) >= 0;
  }

  addDomain() {
    this.validateDomain();
    this.validateDesktopAds();
    this.validateMobileAds();

    if (this.newDomain.trim() && this.selectedPublisher && this.isDomainValid && this.isDesktopAdsValid && this.isMobileAdsValid) {
      const domainData = {
        domain: this.newDomain.trim(),
        desktopAds: parseInt(this.newDesktopAds),
        mobileAds: parseInt(this.newMobileAds),
        publisherName: this.selectedPublisher.publisher.trim()
      };
      console.log(domainData.publisherName)
      this.connectToServer.addDomain(domainData).subscribe({
        next: () => {
          // Update the data and reset
          this.fetchData();
          this.newDomain = '';
          this.newDesktopAds = '';
          this.newMobileAds = '';
          this.isDomainExists = false;
          this.selectedPublisher = null;
          this.toggleAddDomain();
        },
        error: (error) => {
          if (error.status === 409) {
            this.domainExistsMessage = `This domain is already configured on publisher: ${error.error.publisher}`;
            this.isDomainExists = true;
          } else {
            console.error('Error adding domain:', error);
          }
        }
      });
    }
  }

  cancelAddDomain() {
    this.newDomain = '';
    this.newDesktopAds = '';
    this.newMobileAds = '';
    this.selectedPublisher = null;
    this.isDomainValid = true;
    this.isDesktopAdsValid = true;
    this.isMobileAdsValid = true;
    this.domainExistsMessage = '';
    this.isDomainExists = false;
    this.toggleAddDomain();
  }
}
