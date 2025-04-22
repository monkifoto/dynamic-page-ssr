import { Injectable } from '@angular/core';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IntakeForm } from '../model/intake-form.model';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IntakeService {
  private firestore = getFirestore(initializeApp(environment.firebase));
  private basePath = 'businesses';

  saveIntakeForm(intakeForm: IntakeForm, businessId: string): Observable<IntakeForm> {
    const intakeId = doc(collection(this.firestore, `${this.basePath}/${businessId}/intake`)).id;
    const intakeRef = doc(this.firestore, `${this.basePath}/${businessId}/intake/${intakeId}`);

    return new Observable(observer => {
      setDoc(intakeRef, intakeForm).then(() => {
        observer.next(intakeForm);
        observer.complete();
      }).catch(error => {
        console.error('Error saving intake form data', error);
        observer.error(error);
      });
    });
  }

  getIntakeForms(businessId: string): Observable<IntakeForm[]> {
    const intakeRef = collection(this.firestore, `${this.basePath}/${businessId}/intake`);
    return from(getDocs(intakeRef)).pipe(
      map(snapshot => snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...(data as IntakeForm)
        };
      }))
    );
  }

  getIntakeForm(businessId: string, intakeId: string): Observable<IntakeForm | undefined> {
    const intakeDocRef = doc(this.firestore, `${this.basePath}/${businessId}/intake/${intakeId}`);
    return from(getDoc(intakeDocRef)).pipe(
      map(snapshot => snapshot.exists() ? { id: snapshot.id, ...(snapshot.data() as unknown as IntakeForm) } : undefined)
    );
  }

  updateIntakeForm(businessId: string, intakeId: string, intakeForm: Partial<IntakeForm>): Promise<void> {
    const intakeDocRef = doc(this.firestore, `${this.basePath}/${businessId}/intake/${intakeId}`);
    return updateDoc(intakeDocRef, intakeForm);
  }

  deleteIntakeForm(businessId: string, intakeId: string): Promise<void> {
    const intakeDocRef = doc(this.firestore, `${this.basePath}/${businessId}/intake/${intakeId}`);
    return deleteDoc(intakeDocRef);
  }
}
