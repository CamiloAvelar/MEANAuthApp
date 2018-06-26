import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-logingoogle',
  templateUrl: './logingoogle.component.html',
  styleUrls: ['./logingoogle.component.css']
})
export class LogingoogleComponent implements OnInit {

  constructor(
    private authService:AuthService,
    private router:Router,
    private flashMessage:FlashMessagesService
  ) { }

  ngOnInit() {
    this.authService.authenticateUserByGoogle().subscribe(data => {
      console.log(data);
      if(data.success){
        this.authService.storeUserData(data.token, data.user);
        this.flashMessage.show("You're logged!", {
          cssClass: 'alert-success', 
          timeout: 5000
        });
        this.router.navigate(['dashboard']);
      }
    });
  }
}
