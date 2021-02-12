import {Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DocumentModel} from '../../models/document.model';
import {DocumentService} from '../../service/document.service';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {ModalWindowComponent} from '../modal-window/modal-window.component';
import {ECompany} from '../../models/ECompany';
import {ChartComponent} from '../chart/chart.component';
import {concat, forkJoin, merge} from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
  @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

  @ViewChild(ChartComponent) child: ChartComponent;
  editedDocument: DocumentModel;
  public documents: Array<DocumentModel>;
  isNewRecord: boolean;
  public statusMessage = '';
  public company;
  private oldDate: string;

  constructor(private  documentService: DocumentService,
              public  dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: DocumentModel) {
    this.documents = new Array<DocumentModel>();
  }

  getCompany(): void {
    const enumValues: Array<string> = [];
    for (const value in ECompany) {
      if (typeof ECompany[value] === 'number') {
        enumValues.push(value);
      }
    }
    this.company = enumValues;
  }

  ngOnInit(): void {
    this.loadDocuments();
    this.getCompany();

  }

  private loadDocuments(): void {
    this.documentService.getDocuments().subscribe((d: DocumentModel[]) => {
      this.documents = Object.values(d).filter((item) => item.price !== null);
    });
  }

  editDocument(document: DocumentModel): void {
    console.log(document);
    this.editedDocument = new DocumentModel();
    this.editedDocument.id = document.id;
    this.editedDocument.date = document.date;
    this.editedDocument.company = document.company;
    this.editedDocument.price = document.price;
    this.oldDate = document.date;
  }

  loadTemplate(doc: DocumentModel): any {
    if (this.editedDocument && this.editedDocument.id === doc.id) {
      return this.editTemplate;
    } else {
      return this.readOnlyTemplate;
    }
  }

  saveDocument(): void {
    if (this.isNewRecord) {
      this.documentService.sendDocument(this.editedDocument).subscribe(() => {
        this.statusMessage = 'Данные успешно добавлены',
          this.loadDocuments();
      }, () => {
        alert('Ошибка добавления!');
        this.loadDocuments();
      });
      this.isNewRecord = false;
      this.editedDocument = null;
    } else {
      this.documentService.updateDocument(this.editedDocument).subscribe(editedDocument => {
        this.documentService.getByDate(this.oldDate).subscribe(
          documents => {
            for (const i in documents) {
              if (documents[i].price == null) {
                documents[i].date = editedDocument.date;
                this.documentService.updateDocument(documents[i]).subscribe(() => {
                  this.child.loadData();
                  this.statusMessage = 'Данные успешно обновлены';
                });
              }
            }
          });

      }, () => {
        this.statusMessage = 'Ошибка изменения! ',
          this.loadDocuments();
      });
      this.editedDocument = null;
    }
  }

  cancel(): void {
    if (this.isNewRecord) {
      this.documents.pop();
      this.isNewRecord = false;
    }
    this.editedDocument = null;
  }

  deleteDocument(doc: DocumentModel): void {
    console.log('delete');

    this.documentService.getByDate(doc.date).subscribe(
      documents => {
        const requests = [];
        for (const i in documents) {
          if (documents[i].price == null) {
            this.documentService.deleteDocument(documents[i]).subscribe(() => {
              this.statusMessage = 'Данные успешно удалены';
              this.loadDocuments();
              // this.child.loadData();
            });
          }
        }
        this.documentService.deleteDocument(doc).subscribe(() => {
          this.statusMessage = 'Данные успешно удалены';
          this.loadDocuments();
          this.child.loadData();
        });
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalWindowComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.documentService.uploadDocument(result).subscribe(() => {
          this.loadDocuments();
          this.child.loadData();
        }
      );
    });
  }
}
