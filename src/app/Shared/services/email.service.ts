import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private serviceID = 'service_kpd8v4h';
  private templateID = 'template_wyqqvxp';
  private publicKey = '4ShdEmFrFioW2WNe2';

  sendInvoiceEmail(data: {
    to_email: string;
    plan_name: string;
    description: string;
    price: string;
    max_posts: string;
    promotions: string;
    payment_id: string;
  }): Promise<any> {
    return emailjs.send(this.serviceID, this.templateID, data, this.publicKey);
  }
}
