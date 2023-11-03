import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from 'src/app/envoirements/environments';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  router:any = Router;
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  errorCode: string = '';
  constructor( router: Router){this.router = router;}
login(){
  signInWithEmailAndPassword(auth, this.email, this.password)
  .then(() => {

    this.router.navigate(['/']);
  })
  .catch((error) => {
    this.errorCode = error.code;
    const errorMessage = error.message;
  

  });
}
}
