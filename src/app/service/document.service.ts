import {Injectable} from '@angular/core';
import {forkJoin, Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {DocumentModel} from '../models/document.model';
import {ECompany} from '../models/ECompany';
import {log} from 'util';

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
    console.log('deleteDocument');
    const dellUrl = this.URL + '/' + doc.id;
    return this.httpClient.delete(dellUrl);
      // .pipe(
      // catchError(err => {
      //   alert('Ошибка');
      //   return throwError(err);
      // })
    // );
  }

  getByDate(date: string): Observable<any> {
    return this.httpClient.get(this.URL + `?q=${date}`)
      .pipe(map(res => new DocumentModel().deserialize(res)));
  }

  remove(doc: DocumentModel): Observable<any> {
/// при удалении одного, мы должны удалять все документы на эту дату значения цены которых нулл
/// этот метод вставить вместо deleteDocument
//     http://localhost:3000/users?q=yahoo
    const request = [];
    // const dellUrl = this.URL + '/' + doc.id;
    // request.push(this.httpClient.delete(dellUrl));
    const all = this.httpClient.get(this.URL + `?q=${doc.date}`)
      .pipe(map(res => new DocumentModel().deserialize(res)));
    all.subscribe(
      documents => {
        for (const i in documents) {
          if (documents[i].price == null) {
            const dellUrl = this.URL + '/' + documents[i].id;
            // request.push(this.httpClient.delete(dellUrl));
            this.httpClient.delete(dellUrl).subscribe();
          }
        }
        // this.httpClient.delete(dellUrl).subscribe(() => {
        //   return true;
        // });
        // forkJoin(request);
      }
    );

    const dellUrl = this.URL + '/' + doc.id;
    const removed = this.httpClient.delete(dellUrl);
    return forkJoin(all, removed);
  }


}
