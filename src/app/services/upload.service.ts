import { Injectable } from '@angular/core';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc
} from 'firebase/firestore';
import {
  getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject
} from 'firebase/storage';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private firestore = getFirestore(initializeApp(environment.firebase));
  private storage = getStorage(initializeApp(environment.firebase));

  uploadFile(
    file: File,
    businessId: string,
    location: string,
    title: string = '',
    description: string = '',
    link: string = '',
    order: string = ''
  ): { uploadProgress: Observable<number>; downloadUrl: Observable<string> } {
    let filePath: string;

    switch (location) {
      case 'testimonail':
        filePath = `businesses/${businessId}/testimonail/${file.name}`;
        break;
      case 'employee':
        filePath = `businesses/${businessId}/employee/${file.name}`;
        break;
      case 'business':
        filePath = `businesses/${businessId}/business/${file.name}`;
        break;
      case 'heroImages':
        filePath = `businesses/${businessId}/heroImages/${file.name}`;
        break;
      case 'lifeStyle':
        filePath = `businesses/${businessId}/lifeStyle/${file.name}`;
        break;
      case 'sectionsImages':
        filePath = `businesses/${businessId}/sectionsImages/${file.name}`;
        break;
      case 'gallery':
      default:
        filePath = `businesses/${businessId}/gallery/${file.name}`;
        break;
    }

    const fileRef = storageRef(this.storage, filePath);
    const task = uploadBytesResumable(fileRef, file);

    const uploadProgress = new Observable<number>((observer) => {
      task.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          observer.next(progress);
        },
        (error) => observer.error(error),
        () => observer.complete()
      );
    });

    const downloadUrl = new Observable<string>((observer) => {
      task.on(
        'state_changed',
        () => {},
        (error) => observer.error(error),
        async () => {
          const url = await getDownloadURL(fileRef);

          // 🔁 Firestore metadata record
          const metaRef = collection(this.firestore, `businesses/${businessId}/${location}`);
          await addDoc(metaRef, {
            url,
            title,
            description,
            link,
            order
          });

          observer.next(url);
          observer.complete();
        }
      );
    });

    return { uploadProgress, downloadUrl };
  }
  deleteFile(fileUrl: string, businessId: string, location: string): Promise<void> {
    const filePath = this.extractPathFromUrl(fileUrl);
    const fileRef = storageRef(this.storage, filePath);
    return deleteObject(fileRef);
  }

  private extractPathFromUrl(url: string): string {
    // Assumes file URL includes the storage bucket and path
    const decodedUrl = decodeURIComponent(url.split('?')[0]);
    const baseIndex = decodedUrl.indexOf(`/o/`);
    const storagePath = decodedUrl.substring(baseIndex + 3).replace(/%2F/g, '/');
    return storagePath;
  }

  async updateImageMetadata(
    businessId: string,
    location: string,
    image: { url: string; title: string; description: string; link: string; order: string }
  ): Promise<void> {
    const firestore = getFirestore();
    const collRef = collection(firestore, `businesses/${businessId}/${location}`);
    const q = query(collRef, where('url', '==', image.url));
    const snapshot = await getDocs(q);

    for (const docSnap of snapshot.docs) {
      await updateDoc(docSnap.ref, {
        title: image.title,
        description: image.description,
        link: image.link,
        order: image.order,
      });
    }
  }

}
