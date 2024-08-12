import { Component, OnInit } from '@angular/core';
import { PublisherCardComponent } from "./publisher-card/publisher-card.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";


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
    FormsModule
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
  // A domain doesn't start  or end with a hyphen, each label has 1-63 characters (except for the last that is minimum 2) and a a second-label is optionally
  domainPattern: RegExp = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.(?:[A-Za-z0-9-]{1,63}(?<!-)\.)?[A-Za-z]{2,63}$/;
  isDomainValid: boolean = true;
  isDesktopAdsValid: boolean = true;
  isMobileAdsValid: boolean = true;
  isPublisherExists: boolean = false;
  isDomainExists: boolean = false;

  domainsMap: { [key: string]: string } = {}; // Hash map for domain validation
  publishersMap: { [key: string]: number } = {}; // Hash map for publisher validation
  domainExistsMessage: string = '';


  constructor() {
  }

  data: Array<Publisher> = [
    {
      publisher: 'publisher 1',
      domains: [
        {
          domain: "bla.com",
          desktopAds: 5,
          mobileAds: 3,
        },
        {
          domain: "bla1.com",
          desktopAds: 2,
          mobileAds: 30,
        }
      ]
    },
    {
      publisher: 'publisher 2',
      domains: [
        {
          domain: "gar.com",
          desktopAds: 0,
          mobileAds: 4,
        },
        {
          domain: "gar1.com",
          desktopAds: 5,
          mobileAds: 3,
        }
      ]
    }
  ]

  ngOnInit(): void {
    this.initializeMaps();
  }

  initializeMaps() {
    this.data.forEach(publisher => {
      this.publishersMap[publisher.publisher] = 1;
      publisher.domains.forEach(domain => {
        this.domainsMap[domain.domain] = publisher.publisher;
      });
    });
  }

  toggleAddPublisher() {
    this.isAddingPublisher = !this.isAddingPublisher;
  }

  validatePublisher() {
    if (this.publishersMap.hasOwnProperty(this.newPublisherName.trim())) {
      this.isPublisherExists = true;
    } else {
      this.isPublisherExists = false;
    }
  }

  addPublisher() {
    if (this.newPublisherName.trim()) {
      this.validatePublisher();
      if (!this.isPublisherExists) {
        this.data.push({
          publisher: this.newPublisherName.trim(),
          domains: []
        });
        this.publishersMap[this.newPublisherName.trim()] = 1;
        this.newPublisherName = '';
        this.toggleAddPublisher();
      }
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
    if (this.domainsMap.hasOwnProperty(this.newDomain.trim())) {
      this.isDomainExists = true;
      this.domainExistsMessage = `This domain is already configured on publisher: ${this.domainsMap[this.newDomain.trim()]}`;
    } else {
      this.isDomainExists = false;
      this.domainExistsMessage = '';
    }
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
      if (this.isDomainExists) {
        this.domainExistsMessage = `This domain is already configured on publisher: ${this.domainsMap[this.newDomain.trim()]}`;
      } else {
        this.selectedPublisher.domains.push({
          domain: this.newDomain.trim(),
          desktopAds: parseInt(this.newDesktopAds),
          mobileAds: parseInt(this.newMobileAds)
        });
        this.domainsMap[this.newDomain.trim()] = this.selectedPublisher.publisher;
        this.newDomain = '';
        this.newDesktopAds = '';
        this.newMobileAds = '';
        this.selectedPublisher = null;
        this.toggleAddDomain();
      }
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
