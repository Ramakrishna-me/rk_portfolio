import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
})
export class Contact implements AfterViewInit {
  ngAfterViewInit(): void {}
  public sendEmail(e: Event) {
    e.preventDefault();

    emailjs
      .sendForm('service_d31nzh5', 'template_yhk86km', e.target as HTMLFormElement, {
        publicKey: '-T8USfE56nZ-yG7E7',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', (error as EmailJSResponseStatus).text);
        }
      );
  }
}
