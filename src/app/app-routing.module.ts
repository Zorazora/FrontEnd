import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {NavigationComponent} from './navigation/navigation.component';
import {RoomListComponent} from './room-list/room-list.component';
import {PunchComponent} from './punch/punch.component';


const routes: Routes = [
  {path: '', component: RoomListComponent, children: []},
  {path: 'login', component: LoginComponent, children: []},
  {path: 'monitorRoom/:roomId', component: HomeComponent, children: []},
  {path: 'navigation/:streamId', component: NavigationComponent, children: []},
  {path: 'punchRoom/:roomId', component: PunchComponent, children: []}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
