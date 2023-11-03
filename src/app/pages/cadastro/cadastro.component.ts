import { Component, OnInit } from '@angular/core';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from 'src/app/envoirements/environments';
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  router: any = Router;
 errorMessage: string = '';
  idDoc: string = '';
  registerForm: any = FormGroup;
  formbuilder;
  errorCode: string = '';
  constructor(formbuilder: FormBuilder, router: Router) { this.router = router; this.formbuilder = formbuilder }
  ngOnInit(): void {

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

          if (docSnap.data()['isAdmin'] === false) {
            this.router.navigate(['/', 'login']);
          }
        } else {

        }
      } else {
        this.router.navigate(['/', 'login']);
      }
    });

    this.registerForm = this.formbuilder.group({
      name: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }
  cadastrar() {
    createUserWithEmailAndPassword(auth, this.registerForm.value.email, this.registerForm.value.password)
      .then(async (userCredential) => {
        const useruid = userCredential.user.uid;
        this.router.navigate(['/', 'login']);
        await setDoc(doc(db, "users", useruid), {
          name: this.registerForm.value.name,
          lastname: this.registerForm.value.lastname,
          email: this.registerForm.value.email,
          uid: useruid,
          isAdmin: false,
          qtd: 0
        });
      })
      .catch((error) => {
        this.errorCode = error.code;
        const errorMessage = error.message;


      });
  }
}
