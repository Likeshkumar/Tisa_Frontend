import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MakerLayoutComponent } from './layout/maker-layout/maker-layout.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RequestPasswordComponent } from './user-management/password/request-password/request-password.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'layout',
    component: MakerLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./layout/maker-layout/maker-layout.module').then(m => m.MakerLayoutModule),
        canActivate: [AuthGuardService], canActivateChild: [AuthGuardService] //to restrict logout
      },
      {
        path: '',
        loadChildren: () => import('./layout/configuration/configuration.module').then(m => m.ConfigurationModule),
        canActivate: [AuthGuardService], canActivateChild: [AuthGuardService]
      },
      {
        path: '',
        loadChildren: () => import('./layout/personalized-cards/personalized-cards.module').then(m => m.PersonalizedCardsModule),
        canActivate: [AuthGuardService], canActivateChild: [AuthGuardService]
      },
      {
        path: '',
        loadChildren: () => import('./layout/instant-cards/instant-cards.module').then(m => m.InstantCardsModule),
        canActivate: [AuthGuardService], canActivateChild: [AuthGuardService]
      },
      {
        path: '',
        loadChildren: () => import('./layout/card-management/card-management.module').then(m => m.CardManagementModule),
        canActivate: [AuthGuardService], canActivateChild: [AuthGuardService]
      },
      {
        path: '',
        loadChildren: () => import('./layout/report/report.module').then(m => m.ReportModule),
        canActivate: [AuthGuardService], canActivateChild: [AuthGuardService]
      },
      {
        path: '',
        loadChildren: () => import('./layout/user-management/user-management.module').then(m => m.UserManagementModule),
        canActivate: [AuthGuardService], canActivateChild: [AuthGuardService]
      },
      {
        path: '',
        loadChildren: () => import('./layout/inventory/inventory.module').then(m => m.InventoryModule),
        canActivate: [AuthGuardService], canActivateChild: [AuthGuardService]
      }
    ]
  },
  {
    path: 'Request-Password',
    component: RequestPasswordComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true
  })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
