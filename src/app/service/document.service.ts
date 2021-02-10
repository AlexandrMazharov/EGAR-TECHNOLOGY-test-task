import {Injectable} from '@angular/core';
import {concat, forkJoin, observable, Observable, pipe, throwError} from 'rxjs';
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

  getDocumentById(id: number): Observable<DocumentModel> {
    return this.httpClient.get(`http://localhost:3000/animals/?id=${id}`)
      .pipe(map(item => new DocumentModel().deserialize(item)),
        catchError(err => {
          alert('Ошибка');
          console.log(err);
          return throwError(err);
        })
      );
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
          console.log(err);
          return throwError(err);
        }
      )
    );
  }

  public sendDocument(doc: DocumentModel): any {
    console.log(doc);
    return this.httpClient.post(this.URL, this.toObject(doc)).pipe(
      catchError(err => {
        alert('Ошибка');
        console.log(err);
        return throwError(err);
      })
    );
  }

  onlyUnique(value, index, self): any {
    return self.indexOf(value) === index;
  }

  // getLabels(): Observable<any> {
  //   return this.httpClient.get(this.URL).pipe(map(item => {
  //       console.log(item);
  //       new DocumentModel().deserialize(item).date;
  //     }
  //   ));
  //
  // }

  getDataset(): Observable<any> {
    const requests = [];
    for (const value in ECompany) {
      if (typeof ECompany[value] === 'number') {
        requests.push(this.httpClient.get(this.URL + `?company=${value}`));
      }
    }
    return forkJoin(requests);
  }
}
