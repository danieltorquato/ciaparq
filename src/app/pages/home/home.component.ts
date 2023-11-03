import { auth } from '../../envoirements/environments';
import { Component, OnInit } from '@angular/core';
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc, increment, orderBy, limit, deleteDoc } from "firebase/firestore";
import { db } from 'src/app/envoirements/environments';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  numQtd: any;
  router: any = Router;
  active: boolean = false;
  completed: boolean = false;
  lastname: string = '';
  idCustomer: string = '';
  nameCustomer: string = '';
  uid: any;
  nameResponsible: string = '';
  customerDataArray: any[] = [];
  usersDataArray: any[] = [];
  usersCustomerArray: any[] = [];
  quantityCustomers: any;
  idUser: any;
  usersCustomerArrays: any[] = [];
  data: any;
  dateNew = new Date();
  day = this.dateNew.getDate();
  month = this.dateNew.getMonth();
  year = this.dateNew.getFullYear();
  hour = this.dateNew.getHours();
  minutes = this.dateNew.getMinutes();
  seconds = this.dateNew.getSeconds();
  timestamp = Date.now();
  dateCompleted = `${this.day}/${this.month}/${this.year} ${this.hour}:${this.minutes}:${this.seconds}`
  delete = false;
  deleted = false;
  customerResponsible: any;
  customerDelete: any[] = [];
  constructor(router: Router) { this.router = router; }

  ngOnInit(): void {
    onAuthStateChanged(auth, async (user) => {

      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          this.usersDataArray.push(docSnap.data());
          this.idUser = docSnap.data()['uid'];
          this.nameResponsible = `${docSnap.data()['name']} ${docSnap.data()['lastname']}`;
          this.lastIndication(this.idUser);
        } else {

          // docSnap.data() will be undefined in this case

        }

        this.uid = user.uid;

        // ...
      } else {
        this.router.navigate(['/', 'login']);
      }
    });
  }

  async referCustomer() {

    const docRef = doc(db, 'customers', this.idCustomer);
    const querySnapshot = await getDoc(docRef);
    if (querySnapshot.exists()) {
      this.active = true;
      this.completed = false;


    } else {
      const customerId = this.idCustomer;
      this.active = false;
      this.completed = true;
      await setDoc(doc(db, 'users', this.uid, "customers", customerId), {
        id: this.idCustomer,
        responsible: this.uid,
        nameResponsible: this.nameResponsible,
        created: this.dateCompleted,
        timestamp: this.timestamp
      });
      await setDoc(doc(db, "customers", customerId), {
        id: this.idCustomer,
        responsible: this.uid,
        nameResponsible: this.nameResponsible,
        created: this.dateCompleted,
        timestamp: this.timestamp
      });
      await updateDoc(doc(db, "users", this.uid), {
        qtd: increment(1)

      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);


    }


  }

  async lastIndication(uid: any) {
    this.usersCustomerArray = [];
    const q = query(collection(db, 'users', uid, 'customers'), orderBy("timestamp", "desc"), limit(5));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {

      this.usersCustomerArray.push(doc.data());

      // doc.data() is never undefined for query doc snapshots
    });

  }
showDelete(){
  this.delete = !this.delete;

}
  async deleteCustomer(id: any){

  await deleteDoc(doc(db, "customers", id));
  await deleteDoc(doc(db, "users", this.uid, "customers", id));

  const docRef = doc(db, "users", this.uid);

  await updateDoc(docRef, {
    qtd: increment(-1)
  });
  this.deleted = true;
  setTimeout(() => {
    window.location.reload();
  }, 1000)

}
}
