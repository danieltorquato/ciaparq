import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { collection, getDocs, where, orderBy, limit,query } from '@firebase/firestore';
import { AuthCredential, onAuthStateChanged, reauthenticateWithCredential } from 'firebase/auth';
import { deleteDoc, doc, getDoc, increment, onSnapshot, updateDoc } from 'firebase/firestore';
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
  isAdmin: boolean = false;
  uid: any;
  receptionData: any[]=[];
  salesData: any[]=[];
  verified: boolean = false;
  aprove: boolean = false;
  reprovedUser: boolean = false;
  user:any;
  idResponsible: any;
  approvedValue: number = 0;

constructor(router: Router, private renderer: Renderer2, private el: ElementRef){
  this.router = router;
}
  ngOnInit(): void {
    this.dataUserCustomer();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        this.user = user;
        const uid = user.uid;
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);


        if (docSnap.exists()) {
          if (docSnap.data()['superAdmin'] === true && docSnap.data()['isAdmin'] === true) {
            this.isSuperAdmin = true;
            this.isAdmin = true;
          }else if(docSnap.data()['superAdmin'] === false && docSnap.data()['isAdmin'] === true){
            this.isSuperAdmin = false;
            this.isAdmin = true;
          }

          this.actuallyUserArray.push(docSnap.data());
          if (docSnap.data()['isAdmin'] === false) {
            this.router.navigate(['']);
          }
        }
      } else {
        this.router.navigate(['/', 'login']);
      }
    });
  }

  async dataUserCustomer(){

    const qReception = query(collection(db, "users"), where("qtd" , ">=", 1),where("category" , "==", "reception"), orderBy("qtd", "desc"), limit(5));

    const querySnapshotUser = await getDocs(qReception);

    querySnapshotUser.forEach((doc) => {
      this.numQtd = doc.data()['qtd'];
      this.uid = doc.data()['uid']
      this.receptionData.push(doc.data());
    });
    const qSales = query(collection(db, "users"), where("qtd" , ">=", 1),where("category" , "==", "sales"), orderBy("qtd", "desc"), limit(5));

    const querySnapshotSales = await getDocs(qSales);

    querySnapshotSales.forEach((doc) => {
      this.numQtd = doc.data()['qtd'];
      this.uid = doc.data()['uid']
      this.salesData.push(doc.data());
    });


}
  async userCustomers( id: any){
    this.userCustomersArray = []

  const q = query(collection(db, "users", id, "customers"));

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  this.idUserCustomer = doc.data()['id'];
  this.name = doc.data()['nameResponsible'];
  this.idResponsible = doc.data()['responsible'];
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
      setTimeout(() => {
        this.router.navigate(['']);
            }, 1000);
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
  this.docRef = doc.id
  await deleteDoc( doc.ref);
});

  const qReception = query(collection(db, "users", uid, "customers"), where("responsible", "==", this.idUserClear));

  const querySnapshotUser = await getDocs(qReception);
  querySnapshotUser.forEach(async (doc) => {

    this.docRef = doc.id
    await deleteDoc( doc.ref);
  });
  setTimeout(() => {
    this.router.navigate(['']);
  }, 1000);
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

  async numberApproved(id: any){
console.log(id)
const docRef = doc(db, "users", id);
await updateDoc(docRef, {
  numberApprovedDecJan: this.approvedValue
});

}
}
