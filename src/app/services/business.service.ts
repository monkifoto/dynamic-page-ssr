import { Injectable } from '@angular/core';
import {
  Firestore,
} from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, getDocs, collection ,
  setDoc, updateDoc, deleteDoc, addDoc, query, where } from 'firebase/firestore';
import { environment } from '../../environments/environment';

import {
  Storage, ref as storageRef, uploadBytesResumable, getDownloadURL as storageGetDownloadURL
} from '@angular/fire/storage';
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Business, Theme } from '../model/business-questions.model';
import { Section } from '../model/section.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private firestore = getFirestore(initializeApp(environment.firebase));
  private basePath = 'businesses';
  private defaultBusinessId = 'Z93oAAVwFAwhmdH2lLtB';

  constructor( private storage: Storage) {}

  createBusiness(business: Business): Observable<Business> {
    const newDocRef = doc(collection(this.firestore, this.basePath));
    return from(setDoc(newDocRef, { ...business, id: newDocRef.id })).pipe(
      switchMap(() => from(getDoc(newDocRef))),
      map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Business))
    );
  }


  getBusinesses(): Observable<Business[]> {
    const colRef = collection(this.firestore, this.basePath);
    return from(getDocs(colRef)).pipe(
      map((snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() } as Business)))
    );
  }

  getAllBusinesses(): Observable<Business[]> {
    return this.getBusinesses();
  }

  getActiveBusinesses(): Observable<Business[]> {
    const q = query(collection(this.firestore, this.basePath), where('isActive', '==', true));
    return from(getDocs(q)).pipe(
      map((snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() } as Business)))
    );
  }

  getBusiness(id: string): Observable<Business | undefined> {
    return this.getBusinessData(id);
  }

  getBusinessData(businessId: string | null | undefined): Observable<Business | undefined> {
    const resolvedBusinessId = businessId?.trim() || this.defaultBusinessId;
    const businessRef = doc(this.firestore, `${this.basePath}/${resolvedBusinessId}`);

    return from(getDoc(businessRef)).pipe(
      switchMap((docSnap) => {
        if (!docSnap.exists()) return of(undefined);
        const business = { ...docSnap.data(), id: resolvedBusinessId } as Business;

        const sectionsRef = collection(this.firestore, `${this.basePath}/${resolvedBusinessId}/sections`);
        return from(getDocs(sectionsRef)).pipe(
          switchMap((sectionSnaps) => {
            const sections = sectionSnaps.docs.map(s => ({
              id: s.id,
              ...(s.data() as Partial<Section>)
            })) as Section[];
            const updatedBusiness = { ...business, sections };

            const themeRef = doc(this.firestore, `${this.basePath}/${resolvedBusinessId}/theme/themeDoc`);
            return from(getDoc(themeRef)).pipe(
              map((themeSnap) => {
                const themeData = themeSnap.exists()
                  ? (themeSnap.data() as Theme)
                  : this.getDefaultTheme();
                updatedBusiness.theme = themeData;
                return updatedBusiness;
              })
            );
          })
        );
      })
    );
  }

  updateBusiness(id: string, business: Partial<Business>): Promise<void> {
    return updateDoc(doc(this.firestore, `${this.basePath}/${id}`), business);
  }

  deleteBusiness(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, `${this.basePath}/${id}`));
  }

  uploadFile(filePath: string, file: File) {
    const fileRef = storageRef(this.storage, filePath);
    return uploadBytesResumable(fileRef, file);
  }

  getDownloadURL(filePath: string): Observable<string> {
    const fileRef = storageRef(this.storage, filePath);
    return from(storageGetDownloadURL(fileRef));
  }

  updateThemeFileName(themeFileName: string, businessId: string = this.defaultBusinessId): Promise<void> {
    return updateDoc(doc(this.firestore, `${this.basePath}/${businessId}`), {
      'theme.themeFileName': themeFileName
    });
  }

  async getThemeFileName(businessId: string = this.defaultBusinessId): Promise<string> {
    const themeRef = doc(this.firestore, `${this.basePath}/${businessId}/theme/themeDoc`);
    const themeSnap = await getDoc(themeRef);
    return themeSnap.exists() ? (themeSnap.data()?.['themeFileName'] || 'styles.css') : 'default.css';
  }

  createSection(businessId: string, section: any): Promise<any> {
    const sectionsRef = collection(this.firestore, `${this.basePath}/${businessId}/sections`);
    return addDoc(sectionsRef, section);
  }

  getSections(businessId: string): Observable<Section[]> {
    const sectionsRef = collection(this.firestore, `${this.basePath}/${businessId}/sections`);
    return from(getDocs(sectionsRef)).pipe(
      map((snap) => snap.docs.map((d) => ({ id: d.id, ...(d.data() as Partial<Section>) })) as Section[])
    );
  }

  updateSection(businessId: string, sectionId: string, section: any): Promise<void> {
    return updateDoc(doc(this.firestore, `${this.basePath}/${businessId}/sections/${sectionId}`), section);
  }

  deleteSection(businessId: string, sectionId: string): Promise<void> {
    return deleteDoc(doc(this.firestore, `${this.basePath}/${businessId}/sections/${sectionId}`));
  }

  addLocation(businessId: string, location: any): Promise<void> {
    const locationsRef = collection(this.firestore, `${this.basePath}/${businessId}/locations`);
    const newId = doc(locationsRef).id;
    return setDoc(doc(locationsRef, newId), { id: newId, ...location });
  }

  getLocations(businessId: string): Observable<any[]> {
    const locationsRef = collection(this.firestore, `${this.basePath}/${businessId}/locations`);
    return from(getDocs(locationsRef)).pipe(
      map((snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }

  updateLocation(businessId: string, locationId: string, location: any): Promise<void> {
    return updateDoc(doc(this.firestore, `${this.basePath}/${businessId}/locations/${locationId}`), location);
  }

  deleteLocation(businessId: string, locationId: string): Promise<void> {
    return deleteDoc(doc(this.firestore, `${this.basePath}/${businessId}/locations/${locationId}`));
  }

  private getDefaultTheme(): Theme {
    return {
      themeFileName: 'styles.css',
      primaryColor: '#fffaf2',
      secondaryColor: '#f8f3f0',
      accentColor: '#F0C987',
      backgroundColor: '#F5F3E7',
      darkBackgroundColor: '#4C6A56',
      textColor: '#2F2F2F',
      navBackgroundColor: '#F5F3E7',
      navTextColor: '#33372C',
      navActiveBackground: '#33372C',
      navActiveText: '#ffffff',
      buttonColor: '#D9A064',
      buttonHoverColor: '#c9605b',
      themeType: 'demo',
    };
  }
}
