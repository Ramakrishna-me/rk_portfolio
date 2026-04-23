import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { App } from './app';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Work } from './pages/work/work';
import { Contact } from './pages/contact/contact';
import { Navbar } from './shared/navbar/navbar';
import { Background } from './shared/background/background';
import { NgxParticlesModule } from '@tsparticles/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Footer } from './shared/footer/footer';

@NgModule({
  declarations: [App, Home, About, Work, Contact, Navbar, Background, Footer],
  imports: [BrowserModule, AppRoutingModule, NgxParticlesModule, RouterModule, FormsModule],
  bootstrap: [App],
})
export class AppModule {}
