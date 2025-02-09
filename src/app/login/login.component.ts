import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { MessagesService } from "../messages/messages.service";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import e from 'express';

@Component({
  selector: 'login',
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  authServiice = inject(AuthService);
  fb = inject(FormBuilder);

  form = this.fb.group({
    email: [''],
    password: ['']
  });

  messagesService = inject(MessagesService);
  router = inject(Router);

  onLogin = async () => {
    try {
      const { email, password } = this.form.value;

      if (!email || !password) {
        this.messagesService.showMessage('Please enter email and password.', 'error');
        return;
      }

      await this.authServiice.login(email, password)
      await this.router.navigate(['/home']);

    } catch (error) {
      console.error(error);
      this.messagesService.showMessage('Login failed, please try again.', 'error');
    }
  }

}
