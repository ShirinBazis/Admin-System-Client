import { Component, Input } from '@angular/core';
import { Domain } from "../publishers-container.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-domain-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './domain-card.component.html',
  styleUrl: './domain-card.component.css'
})
export class DomainCardComponent {
  @Input() domain!: Domain;
  @Input() domainsMap!: { [key: string]: string };
  isEdit: boolean = false;
  inputDomain!: Domain;
  domainPattern: RegExp = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.(?:[A-Za-z0-9-]{1,63}(?<!-)\.)?[A-Za-z]{2,63}$/;
  isDomainValid: boolean = true;
  isDesktopAdsValid: boolean = true;
  isMobileAdsValid: boolean = true;
  isDomainExists: boolean = false;
  domainExistsMessage: string = '';

  constructor() {
  }

  ngOnInit(): void {
    this.inputDomain = JSON.parse(JSON.stringify(this.domain));
  }

  toggleEdit() {
    this.isEdit = !this.isEdit;
  }

  validateDomain() {
    this.isDomainValid = this.domainPattern.test(this.inputDomain.domain.trim());
    if (this.inputDomain.domain.trim() !== this.domain.domain && this.domainsMap.hasOwnProperty(this.inputDomain.domain.trim())) {
      this.isDomainExists = true;
      this.domainExistsMessage = `This domain is already configured on publisher: ${this.domainsMap[this.inputDomain.domain.trim()]}`;
    } else {
      this.isDomainExists = false;
      this.domainExistsMessage = '';
    }
  }

  validateDesktopAds() {
    this.isDesktopAdsValid = Number.isInteger(this.inputDomain.desktopAds) && this.inputDomain.desktopAds >= 0;
  }

  validateMobileAds() {
    this.isMobileAdsValid = Number.isInteger(this.inputDomain.mobileAds) && this.inputDomain.mobileAds >= 0;
  }

  editDomain() {
    this.validateDomain();
    this.validateDesktopAds();
    this.validateMobileAds();

    if (this.isDomainValid && this.isDesktopAdsValid && this.isMobileAdsValid) {
      if (this.isDomainExists) {
        this.domainExistsMessage = `This domain is already configured on publisher: ${this.domainsMap[this.inputDomain.domain.trim()]}`;
      } else {
        if (this.inputDomain.domain.trim() !== this.domain.domain) {
          this.domainsMap[this.inputDomain.domain.trim()] = this.domainsMap[this.domain.domain.trim()];
          delete this.domainsMap[this.domain.domain];
        }
      this.domain = JSON.parse(JSON.stringify(this.inputDomain));
      this.toggleEdit()
      //this.domainExistsMessage = '';
      }
    }
  }

  cancelEditDomain() {
    this.ngOnInit()
    this.toggleEdit()
    this.isDomainValid = true;
    this.isDesktopAdsValid = true;
    this.isMobileAdsValid = true;
    this.domainExistsMessage = '';
    this.isDomainExists = false;
  }
}
