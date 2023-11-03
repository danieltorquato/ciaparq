import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { collection, getDocs, where, orderBy, limit,query } from '@firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from 'src/app/envoirements/environments';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  customerDataArray: any[]=[];
  quantityCustomers: any;
  numQtd: any;
  usersDataArray: any[] = [];
  userCustomersArray: any[] = [];
  router: Router;

constructor(router: Router){
  this.router = router;
}
  ngOnInit(): void {
    this.dataUserCustomer();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

          if (docSnap.data()['isAdmin'] === false) {
            this.router.navigate(['']);
          }
        } else {

        }
      } else {
        this.router.navigate(['/', 'login']);
      }
    });
  }

  async dataUserCustomer(){
    const q = query(collection(db, "customers") );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      this.customerDataArray.push(doc.data());
      // doc.data() is never undefined for query doc snapshots
    });
    this.quantityCustomers = this.customerDataArray.length

    const qUser = query(collection(db, "users"), where("qtd" , ">=", 1), orderBy("qtd", "desc"), limit(5));

    const querySnapshotUser = await getDocs(qUser);

    querySnapshotUser.forEach((doc) => {
      this.numQtd = doc.data()['qtd'];

      this.usersDataArray.push(doc.data());
    });


}
  async userCustomers(id: any){
    this.userCustomersArray = []
  const q = query(collection(db, "users", id, "customers"));

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  this.userCustomersArray.push(doc.data())
  // doc.data() is never undefined for query doc snapshots

});
}
}
