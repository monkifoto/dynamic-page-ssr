import { Injectable } from '@angular/core';
import {
  getFirestore, collection, doc, setDoc, deleteDoc, getDocs, query, where
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Section } from '../model/section.model';
import { UploadService } from './upload.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessSectionsService {
  private firestore = getFirestore(initializeApp(environment.firebase));
  private collectionName = 'businesses';

  constructor(private uploadService: UploadService) {}

  generateNewId(): string {
    return doc(collection(this.firestore, this.collectionName)).id;
  }

  getAllBusinesses(): Observable<any[]> {
    const businessesRef = collection(this.firestore, this.collectionName);
    return from(getDocs(businessesRef)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    );
  }

  getAllBusinessSections(businessId: string): Observable<Section[]> {
    const sectionsRef = collection(this.firestore, `${this.collectionName}/${businessId}/sections`);
    return from(getDocs(sectionsRef)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Partial<Section>) })) as Section[])
    );
  }

  getBusinessSections(businessId: string, page: string): Observable<Section[]> {
    const sectionsQuery = query(
      collection(this.firestore, `${this.collectionName}/${businessId}/sections`),
      where('page', '==', page)
    );
    return from(getDocs(sectionsQuery)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Partial<Section>) })) as Section[])
    );
  }

  saveSection(businessId: string, section: Section): Promise<void> {
    console.log("🔄 Attempting to save section:", section);

    if (!section.id || section.id.trim() === '') {
      section.id = this.generateNewId();
    } else {
      console.log("✏️ Updating existing section with ID:", section.id);
    }

    const sectionRef = doc(this.firestore, `${this.collectionName}/${businessId}/sections/${section.id}`);
    return setDoc(sectionRef, section, { merge: true });
  }

  deleteSection(businessId: string, sectionId: string): Promise<void> {
    const sectionRef = doc(this.firestore, `${this.collectionName}/${businessId}/sections/${sectionId}`);
    return deleteDoc(sectionRef);
  }

  async uploadImage(
    file: File,
    businessId: string,
    sectionId: string,
    title: string = '',
    description: string = '',
    link: string = '',
    order: string = ''
  ): Promise<string> {
    try {
      const { downloadUrl } = this.uploadService.uploadFile(file, businessId, 'sections', title, description, link, order);

      return new Promise((resolve, reject) => {
        downloadUrl.subscribe({
          next: (url) => {
            if (!url) {
              reject("❌ Image URL is undefined.");
            } else {
              console.log("✅ Image uploaded successfully:", url);
              resolve(url);
            }
          },
          error: (error) => {
            console.error("❌ Error getting image URL:", error);
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      return "";
    }
  }

  private mapComponent(sectionType: string): string {
    const componentMap: { [key: string]: string } = {
      'center-text': 'center-text',
      'left-text': 'left-text',
      'right-text': 'right-text',
      'list-item': 'list-item',
    };
    return componentMap[sectionType] || 'default-component';
  }
}
