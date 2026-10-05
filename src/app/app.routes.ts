import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home-page').then((m) => m.HomePage),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about-page').then((m) => m.AboutPage),
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services-page').then((m) => m.ServicesPage),
  },
  {
    path: 'solutions',
    loadComponent: () => import('./pages/solutions-page').then((m) => m.SolutionsPage),
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products-page').then((m) => m.ProductsPage),
  },
  {
    path: 'industries',
    loadComponent: () => import('./pages/industries-page').then((m) => m.IndustriesPage),
  },
  {
    path: 'technologies',
    loadComponent: () => import('./pages/technologies-page').then((m) => m.TechnologiesPage),
  },
  {
    path: 'careers',
    loadComponent: () => import('./pages/careers-page').then((m) => m.CareersPage),
  },
  {
    path: 'addsystransjob',
    loadComponent: () => import('./pages/add-systrans-job-page').then((m) => m.AddSysTransJobPage),
  },
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog-page').then((m) => m.BlogPage),
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./pages/blog-detail-page').then((m) => m.BlogDetailPage),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact-page').then((m) => m.ContactPage),
  },
  {
    path: 'visitingCard',
    loadComponent: () =>
      import('./features/visiting-card/pages/visiting-card-page.component').then(
        (m) => m.VisitingCardPageComponent,
      ),
  },
  { path: '**', redirectTo: '/home' },
];
