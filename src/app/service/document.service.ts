import {Injectable} from '@angular/core';
import {forkJoin, Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {DocumentModel} from '../models/document.model';
import {ECompany} from '../models/ECompany';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private URL = 'http://localhost:3000/documents';

  constructor(private httpClient: HttpClient) {
  }

  public getDocuments(): Observable<any> {
    return this.httpClient.get(this.URL).pipe(map(res => new DocumentModel().deserialize(res)));
  }

  toObject(doc: DocumentModel): object {
    return {
      id: doc.id,
      date: doc.date,
      company: doc.company,
      price: doc.price
    };
  }

  public updateDocument(doc: DocumentModel): Observable<any> {
    const updateUrl = this.URL + '/' + doc.id;
    return this.httpClient.patch(updateUrl, this.toObject(doc)).pipe(
      catchError(err => {
          alert('Ошибка');
          return throwError(err);
        }
      )
    );
  }

  public uploadDocument(doc: DocumentModel): Observable<any> {
    const requests = [];
    for (const value in ECompany) {
      if (typeof ECompany[value] === 'number') {

        if (value !== doc.company) {
          const document = new DocumentModel();
          document.date = doc.date;
          document.price = null;
          document.company = value;
          requests.push(this.httpClient.post(this.URL, this.toObject(document)));
        }
      }
    }
    requests.push(this.httpClient.post(this.URL, this.toObject(doc)));
    return forkJoin(requests);
  }

  public sendDocument(doc: DocumentModel): any {

    return this.httpClient.post(this.URL, this.toObject(doc)).pipe(
      catchError(err => {
        alert('Ошибка');
        console.log(err);
        return throwError(err);
      })
    );
  }

  getDataset(): Observable<any> {
    const requests = [];
    for (const value in ECompany) {
      if (typeof ECompany[value] === 'number') {
        requests.push(this.httpClient.get(this.URL + `?company=${value}`));
      }
    }
    return forkJoin(requests);
  }

  deleteDocument(doc: DocumentModel): any {
    const dellUrl = this.URL + '/' + doc.id;
    return this.httpClient.delete(dellUrl).pipe(
      catchError(err => {
        alert('Ошибка');
        return throwError(err);
      })
    );
  }

}
