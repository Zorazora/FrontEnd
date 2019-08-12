import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {NavigationComponent} from './navigation/navigation.component';


const routes: Routes = [
  {path: '', component: HomeComponent, children: []},
  {path: 'login', component: LoginComponent, children: []},
  {path: 'navigation/:id', component: NavigationComponent, children: []}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
