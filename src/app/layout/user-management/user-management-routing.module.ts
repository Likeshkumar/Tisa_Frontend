import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthProfileComponent } from 'app/user-management/checker/auth-profile/auth-profile.component';
import { AuthUserComponent } from 'app/user-management/checker/auth-user/auth-user.component';
import { ProfileComponent } from 'app/user-management/maker/profile/profile.component';
import { UserComponent } from 'app/user-management/maker/user/user.component';
import { GeneratePasswordComponent } from 'app/user-management/password/generate-password/generate-password.component';
import { AuthUnblockUserComponent } from 'app/user-management/unblock/auth-unblock-user/auth-unblock-user.component';
import { UnblockUserComponent } from 'app/user-management/unblock/unblock-user/unblock-user.component';


const routes: Routes = [

  //Maker
  
  { path: 'Profile', component: ProfileComponent },
  { path: 'User', component: UserComponent },
  { path: 'Generate-Password', component: GeneratePasswordComponent },
  { path: 'UnBlock-User', component: UnblockUserComponent },

  //Checker

  { path: 'Profile-Auth', component: AuthProfileComponent },
  { path: 'User-Auth', component: AuthUserComponent },
  { path: 'UnBlock-User-Auth', component: AuthUnblockUserComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
