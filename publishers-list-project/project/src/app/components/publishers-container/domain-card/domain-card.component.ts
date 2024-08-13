import { Component, Input } from '@angular/core';
import { ConnectToServer } from '../../../connect-to-server.component';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Domain, PublishersContainerComponent } from '../publishers-container.component';

@Component({
  selector: 'app-domain-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './domain-card.component.html',
  styleUrl: './domain-card.component.css'
})
export class DomainCardComponent {
  @Input() domain!: Domain;
  isEdit: boolean = false;
  inputDomain!: Domain;
  isDomainValid: boolean = true;
  isDesktopAdsValid: boolean = true;
  isMobileAdsValid: boolean = true;
  isDomainExists: boolean = false;
  domainExistsMessage: string = '';

  constructor(private connectToServer: ConnectToServer, private publishersContainer: PublishersContainerComponent) {
  }

  ngOnInit(): void {
    this.inputDomain = { ...this.domain };
  }

  toggleEdit() {
    this.isEdit = !this.isEdit;
  }

  validateDomain() {
    this.isDomainValid = this.publishersContainer.domainPattern.test(this.inputDomain.domain.trim());
    this.isDomainExists = false;
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
      const newDomain = {
        domain: this.inputDomain.domain.trim(),
        desktopAds: this.inputDomain.desktopAds,
        mobileAds: this.inputDomain.mobileAds,
      };
      console.log(newDomain.domain)
      this.connectToServer.updateDomain(this.domain, newDomain).subscribe({
        next: () => {
          // update current domain data
          this.domain = { ...newDomain };
          this.isDomainExists = false;
          this.toggleEdit()
        },
        error: (error) => {
          // Domain allready exists
          if (error.status === 409) {
            this.domainExistsMessage = `This domain is already configured on publisher: ${error.error.publisher}`;
            this.isDomainExists = true;
          // There was no edit- then cancel
          } else if (error.status === 400) {
            this.cancelEditDomain();
          } else {
            console.error('Error updating domain:', error);
          }
        }
      });
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
