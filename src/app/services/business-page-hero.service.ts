import { Injectable } from '@angular/core';
import {
  getFirestore, collection, getDocs, doc, setDoc, deleteDoc, addDoc
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PageHero } from '../model/business-questions.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessPageHeroService {
  private firestore = getFirestore(initializeApp(environment.firebase));

  generateNewId(): string {
    return doc(collection(this.firestore, 'temp')).id; // For ID generation only
  }

  getPageHeroes(businessId: string): Observable<PageHero[]> {
    const heroesRef = collection(this.firestore, `businesses/${businessId}/pageHeroes`);
    return from(getDocs(heroesRef)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PageHero[])
    );
  }

  savePageHero(businessId: string, hero: PageHero): Promise<void | any> {
    const heroRef = collection(this.firestore, `businesses/${businessId}/pageHeroes`);
    if (hero.id) {
      return setDoc(doc(this.firestore, `businesses/${businessId}/pageHeroes/${hero.id}`), hero);
    } else {
      return addDoc(heroRef, hero);
    }
  }

  deletePageHero(businessId: string, heroId: string): Promise<void> {
    const heroDocRef = doc(this.firestore, `businesses/${businessId}/pageHeroes/${heroId}`);
    return deleteDoc(heroDocRef);
  }
}
