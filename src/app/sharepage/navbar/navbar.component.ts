import { Component, OnInit } from '@angular/core';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from 'src/app/envoirements/environments';
import { Router } from '@angular/router';
import { doc, getDoc } from 'firebase/firestore';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  router: any = Router;
  toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
  isAdmin = false;
  constructor(router: Router) { this.router = router; }
  ngOnInit(): void {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

          if (docSnap.data()['isAdmin'] === true) {
            this.isAdmin = true;
          }
        } else {

        }
      } else {
        this.router.navigate(['/', 'login']);
      }
    });
  }
  signOut() {
    signOut(auth).then(() => {
      this.router.navigate(['/', 'login']);
    }).catch((error) => {
      // An error happened.
    });
  }
  modeColor(){
    document.body.classList.toggle('light-theme');
  }

}
