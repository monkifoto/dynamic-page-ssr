import { Injectable } from '@angular/core';
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from 'firebase/storage';
import { Observable, catchError, map, of, from } from 'rxjs';
import { Business, Employee, HeroImage } from '../model/business-questions.model';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebContentService {
  private firestore = getFirestore(initializeApp(environment.firebase));
  private storage = getStorage(initializeApp(environment.firebase));
  private defaultBusinessId = 'Z93oAAVwFAwhmdH2lLtB';
  private defaultImage = 'assets/sharedAssets/missingTestimonialImage.png';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getBusinessData(businessId: string | null | undefined): Observable<Business | undefined> {
    if (!isPlatformBrowser(this.platformId)) {
      console.log('⛔ SSR detected, skipping getBusinessData call');
      return of(undefined);
    }
    const resolvedId = businessId?.trim() || this.defaultBusinessId;
    const businessRef = doc(this.firestore, `businesses/${resolvedId}`);

    return from(getDoc(businessRef)).pipe(
      map((docSnap) => {
        if (!docSnap.exists()) {
          console.warn(`Business document not found for ID: ${resolvedId}`);
          return undefined;
        }
        const data = docSnap.data() as Business;
        const { id: _, testimonials = [], ...rest } = data;

        const updatedTestimonials = testimonials.map((t) => ({
          ...t,
          photoURL: t.photoURL?.trim() ? t.photoURL : this.defaultImage,
        }));

        return { id: resolvedId, testimonials: updatedTestimonials, ...rest };
      })
    );
  }

  getDefaultBusinessData(): Observable<Business | undefined> {
    return this.getBusinessData(this.defaultBusinessId);
  }

  getEmployees(): Observable<Employee[]> {
    const employeesRef = collection(this.firestore, 'employees');
    return from(getDocs(employeesRef)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee))
      )
    );
  }

  getEmployeePhoto(photoPath: string): Observable<string> {
    const fileRef = storageRef(this.storage, photoPath);
    return from(getDownloadURL(fileRef)).pipe(
      catchError((error) => {
        console.error('Error fetching photo URL:', error);
        return of('');
      })
    );
  }

  getEmployeesByBusinessId(businessId: string): Observable<Employee[]> {
    const resolvedId = businessId?.trim() || this.defaultBusinessId;
    const businessRef = doc(this.firestore, `businesses/${resolvedId}`);

    return from(getDoc(businessRef)).pipe(
      map((docSnap) => {
        if (!docSnap.exists()) {
          console.warn('Business document does not exist.');
          return [];
        }
        const data = docSnap.data();
        return (data && data['employees']) ? data['employees'] : [];
      }),
      catchError((error) => {
        console.error('Error fetching employees:', error);
        return of([]);
      })
    );
  }

  getBusinessGalleryImagesById(businessId: string): Observable<any[]> {
    const resolvedId = businessId?.trim() || this.defaultBusinessId;
    const galleryRef = collection(this.firestore, `businesses/${resolvedId}/gallery`);
    return from(getDocs(galleryRef)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    );
  }

  getBusinessLifeStyleGalleryImagesById(businessId: string): Observable<any[]> {
    return this.getBusinessGalleryImagesById(businessId); // Assuming same collection for now
  }

  getBusinessUploadedImagesById(businessId: string, uploadLocation: string): Observable<HeroImage[]> {
    const resolvedId = businessId?.trim() || this.defaultBusinessId;
    const uploadRef = collection(this.firestore, `businesses/${resolvedId}/${uploadLocation}`);
    return from(getDocs(uploadRef)).pipe(
      map(snapshot => snapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, url: data['url'] || '', ...data } as HeroImage;
      }))
    );
  }

  checkImageExists(imageUrl: string): Promise<boolean> {
    const ref = storageRef(this.storage, imageUrl);
    return getDownloadURL(ref)
      .then(() => true)
      .catch(() => false);
  }
}
