import { AfterViewInit, Component } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
})
export class Contact implements AfterViewInit {
  showPopup = false;

  ngAfterViewInit(): void {}

  public sendEmail(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    emailjs
      .sendForm('service_d31nzh5', 'template_yhk86km', form, {
        publicKey: '-T8USfE56nZ-yG7E7',
      })
      .then(
        () => {
          form.reset();
          this.showPopup = true;

          setTimeout(() => {
            this.showPopup = false;
          }, 3000);
        },
        (error) => {
          console.log('FAILED...', (error as EmailJSResponseStatus).text);
        }
      );
  }
}
