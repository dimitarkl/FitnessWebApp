import { Injectable } from '@angular/core';
import { collection, getDocs } from 'firebase/firestore';
import { from, map, Observable } from 'rxjs';
import { db } from '../../lib/firebase';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  getCollectionData = (): any => {
    console.log('bacam')
    const data: any[] = [];

    from(getDocs(collection(db, '1'))).pipe(
      map(querySnapshot => {
        querySnapshot.forEach(doc => {
          const docData = doc.data();
          data.push({
            id: doc.id,
            text: docData["text"],
          });
        });
      })
    )
    return data
  };
  constructor() { }
}
