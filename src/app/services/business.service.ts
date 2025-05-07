import { Injectable, EnvironmentInjector } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  Timestamp
} from '@angular/fire/firestore';
import {
  Storage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL as storageGetDownloadURL
} from '@angular/fire/storage';
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Business, Theme } from '../model/business-questions.model';
import { Section } from '../model/section.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private basePath = 'businesses';
  private defaultBusinessId = 'MGou3rzTVIbP77OLmZa7';

  constructor(
    private firestore: Firestore,
    private storage: Storage,
    private injector: EnvironmentInjector
  ) {}

  private run<T>(fn: () => T): T {
    return this.injector.runInContext(fn);
  }

  createBusiness(business: Business): Observable<Business> {
    const newDocRef = this.run(() => doc(collection(this.firestore, this.basePath)));
    const businessWithDate = {
      ...business,
      id: newDocRef.id,
      createdDate: new Date()
    };

    return from(this.run(() => setDoc(newDocRef, businessWithDate))).pipe(
      switchMap(() => from(this.run(() => getDoc(newDocRef)))),
      map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Business))
    );
  }

  getBusinesses(): Observable<Business[]> {
    return from(this.run(() => getDocs(collection(this.firestore, this.basePath)))).pipe(
      map((snap) =>
        snap.docs.map((d) => {
          const businessData = { id: d.id, ...d.data() } as Business;

          if (businessData.createdDate instanceof Timestamp) {
            businessData.createdDate = businessData.createdDate.toDate();
          }
          if (businessData.updatedDate instanceof Timestamp) {
            businessData.updatedDate = businessData.updatedDate.toDate();
          }

          return businessData;
        })
      )
    );
  }

  getAllBusinesses(): Observable<Business[]> {
    return this.getBusinesses();
  }

  getActiveBusinesses(): Observable<Business[]> {
    return from(this.run(() =>
      getDocs(query(collection(this.firestore, this.basePath), where('isActive', '==', true)))
    )).pipe(
      map((snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() } as Business)))
    );
  }

  getBusinessData(businessId: string | null | undefined): Observable<Business | undefined> {
    console.log('getBusinessData called with businessId:', businessId);
    const resolvedBusinessId = businessId?.trim() || this.defaultBusinessId;
    const businessRef = this.run(() => doc(this.firestore, `${this.basePath}/${resolvedBusinessId}`));

    return from(this.run(() => getDoc(businessRef))).pipe(
      switchMap((docSnap) => {
        if (!docSnap.exists()) return of(undefined);
        const business = { ...docSnap.data(), id: resolvedBusinessId } as Business;

        if (business.createdDate instanceof Timestamp) {
          business.createdDate = business.createdDate.toDate();
        }
        if (business.updatedDate instanceof Timestamp) {
          business.updatedDate = business.updatedDate.toDate();
        }

        const sectionsRef = collection(this.firestore, `${this.basePath}/${resolvedBusinessId}/sections`);
        return from(this.run(() => getDocs(sectionsRef))).pipe(
          switchMap((sectionSnaps) => {
            const sections = sectionSnaps.docs.map(s => ({
              id: s.id,
              ...(s.data() as Partial<Section>)
            })) as Section[];
            const updatedBusiness = { ...business, sections };

            const themeRef = doc(this.firestore, `${this.basePath}/${resolvedBusinessId}/theme/themeDoc`);
            return from(this.run(() => getDoc(themeRef))).pipe(
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

  getBusiness(id: string): Observable<Business | undefined> {
    console.log('getBusiness called with id:', id);
    return this.getBusinessData(id);
  }

  updateBusiness(id: string, business: Partial<Business>): Promise<void> {
    const updatedBusiness = { ...business, updatedDate: new Date() };
    return this.run(() => updateDoc(doc(this.firestore, `${this.basePath}/${id}`), updatedBusiness));
  }

  deleteBusiness(id: string): Promise<void> {
    return this.run(() => deleteDoc(doc(this.firestore, `${this.basePath}/${id}`)));
  }

  uploadFile(filePath: string, file: File) {
    const fileRef = this.run(() => storageRef(this.storage, filePath));
    return this.run(() => uploadBytesResumable(fileRef, file));
  }

  getDownloadURL(filePath: string): Observable<string> {
    const fileRef = this.run(() => storageRef(this.storage, filePath));
    return from(this.run(() => storageGetDownloadURL(fileRef)));
  }

  updateThemeFileName(themeFileName: string, businessId: string = this.defaultBusinessId): Promise<void> {
    return this.run(() =>
      updateDoc(doc(this.firestore, `${this.basePath}/${businessId}`), {
        'theme.themeFileName': themeFileName
      })
    );
  }

  async getThemeFileName(businessId: string = this.defaultBusinessId): Promise<string> {
    console.log
    const themeRef = doc(this.firestore, `${this.basePath}/${businessId}/theme/themeDoc`);
    const themeSnap = await this.run(() => getDoc(themeRef));
    return themeSnap.exists() ? (themeSnap.data()?.['themeFileName'] || 'styles.css') : 'default.css';
  }

  createSection(businessId: string, section: any): Promise<any> {
    const sectionsRef = collection(this.firestore, `${this.basePath}/${businessId}/sections`);
    return this.run(() => addDoc(sectionsRef, section));
  }

  getSections(businessId: string): Observable<Section[]> {
    return from(this.run(() => getDocs(collection(this.firestore, `${this.basePath}/${businessId}/sections`)))).pipe(
      map((snap) => snap.docs.map((d) => ({ id: d.id, ...(d.data() as Partial<Section>) })) as Section[])
    );
  }

  updateSection(businessId: string, sectionId: string, section: any): Promise<void> {
    return this.run(() =>
      updateDoc(doc(this.firestore, `${this.basePath}/${businessId}/sections/${sectionId}`), section)
    );
  }

  deleteSection(businessId: string, sectionId: string): Promise<void> {
    return this.run(() =>
      deleteDoc(doc(this.firestore, `${this.basePath}/${businessId}/sections/${sectionId}`))
    );
  }

  addLocation(businessId: string, location: any): Promise<void> {
    const locationsRef = collection(this.firestore, `${this.basePath}/${businessId}/locations`);
    const newId = doc(locationsRef).id;
    return this.run(() => setDoc(doc(locationsRef, newId), { id: newId, ...location }));
  }

  getLocations(businessId: string): Observable<any[]> {
    return from(this.run(() =>
      getDocs(collection(this.firestore, `${this.basePath}/${businessId}/locations`))
    )).pipe(map((snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
  }

  updateLocation(businessId: string, locationId: string, location: any): Promise<void> {
    return this.run(() =>
      updateDoc(doc(this.firestore, `${this.basePath}/${businessId}/locations/${locationId}`), location)
    );
  }

  deleteLocation(businessId: string, locationId: string): Promise<void> {
    return this.run(() =>
      deleteDoc(doc(this.firestore, `${this.basePath}/${businessId}/locations/${locationId}`))
    );
  }

  private getDefaultTheme(): Theme {
    console.log('🟢 [business.service.ts] Using default theme');
    return {
      themeFileName: 'sb.css',
      primaryColor: '#ffffff',
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
      themeType: 'sb',
    };
  }
}
