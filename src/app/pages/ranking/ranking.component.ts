import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { collection, getDocs, where, orderBy, limit,query } from '@firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { deleteDoc, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from 'src/app/envoirements/environments';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  name: string = '';
  lastName: string = '';
  customerDataArray: any[]=[];
  quantityCustomers: any;
  numQtd: any;
  usersDataArray: any[] = [];
  userCustomersArray: any[] = [];
  router: Router;
  isSuperAdmin:boolean = false;
  clearAllBool:boolean = false;
  actuallyUserArray: any[] = [];
  idUser: any;
  idUserClear: string = ''
  idUserCustomer: string = '';
  docRef: any;
  idCustomer: any;
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
this.actuallyUserArray.push(docSnap.data());
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
  this.idUserCustomer = doc.data()['id'];
  this.name = doc.data()['nameResponsible'];
  this.userCustomersArray.push(doc.data())
  // doc.data() is never undefined for query doc snapshots

});
}
  async clearAll(){
    this.clearAllBool = false;

  const q = query(collection(db, "users"));

  const querySnapshot= await getDocs(q);
  querySnapshot.forEach(async (doc) => {

        await updateDoc(doc.ref, {
          qtd: 0
        });
        const qCustomer = query(collection(db, "users", doc.data()['uid'],"customers"));

        const querySnapshotCustomer= await getDocs(qCustomer);
        querySnapshotCustomer.forEach(async (doc) => {
              this.idCustomer = doc.data()['id'];
               await deleteDoc( doc.ref);

            });
        const qCustomers = query(collection(db, "customers"));

        const querySnapshotCustomers= await getDocs(qCustomers);
        querySnapshotCustomers.forEach(async (doc) => {


               await deleteDoc( doc.ref);

            });


      });





}
  async clearUserHistory(uid: any){
  this.clearAllBool = false;
  // Atualiza a quantidade para 0
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    qtd: 0
  });
  const q = query(collection(db, "customers"), where("responsible", "==", this.idUserClear));

const querySnapshot = await getDocs(q);
querySnapshot.forEach(async (doc) => {
  // doc.data() is never undefined for query doc snapshots

  this.docRef = doc.id
  await deleteDoc( doc.ref);
});

  const qUser = query(collection(db, "users", uid, "customers"), where("responsible", "==", this.idUserClear));

  const querySnapshotUser = await getDocs(qUser);
  querySnapshotUser.forEach(async (doc) => {

    this.docRef = doc.id
    await deleteDoc( doc.ref);
  });

}
  async generalClear(uid: any){
  this.idUserClear = uid;
  const q = query(collection(db, "users"), where("uid", "==", uid));

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  this.name = doc.data()['name'];
  this.lastName = doc.data()['lastname'];
  // doc.data() is never undefined for query doc snapshots

});
  setTimeout(() => {
    this.clearAllBool = true;
  }, 3000);
}
}
