import { Routes } from '@angular/router';
import { HomeComponent } from '../app/Pages/home/home.component';
import { TxtInputComponent } from '../app/Shared/components/txt-input/txt-input.component';
import { ChatMessageComponent } from '../app/Shared/components/chat-message/chat-message.component';
import { LoginComponent } from '../app/Pages/login/login.component';
import { ForgotPasswordComponent } from '../app/Pages/forgot-password/forgot-password.component';
import { RegisterComponent } from './Pages/register/register.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirección por defecto a login
    { path: 'home', component: HomeComponent },
    { path: 'input', component: TxtInputComponent },
    { path: 'chat', component: ChatMessageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: '**', redirectTo: 'home' }, // Ruta comodín para rutas no válidas
];
