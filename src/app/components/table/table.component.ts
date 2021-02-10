import {Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DocumentModel} from '../../models/document.model';
import {DocumentService} from '../../service/document.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ModalWindowComponent} from '../modal-window/modal-window.component';
import {ECompany} from '../../models/ECompany';
import {ChartComponent} from '../chart/chart.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
  @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

  @ViewChild(ChartComponent ) child: ChartComponent ;
  editedDocument: DocumentModel;
  public documents: Array<DocumentModel>;
  isNewRecord: boolean;
  public statusMessage = '';
  public company;

  constructor(private  documentService: DocumentService,
              public  dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: DocumentModel) {
    this.documents = new Array<DocumentModel>();
    // console.log(this.data);
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
    this.documentService.getDocuments().subscribe((data: DocumentModel[]) => {
      // console.log(data);
      // this.child.loadData();
      this.documents = Object.values(data);
    });
  }

  editDocument(document: DocumentModel): void {
    console.log(document);
    this.editedDocument = new DocumentModel();
    this.editedDocument.id = document.id;
    this.editedDocument.date = document.date;
    this.editedDocument.company = document.company;
    this.editedDocument.price = document.price;
  }

  // загружаем один из двух шаблонов
  loadTemplate(doc: DocumentModel): any {
    if (this.editedDocument && this.editedDocument.id === doc.id) {
      return this.editTemplate;
    } else {
      return this.readOnlyTemplate;
    }
  }

  // сохраняем
  saveDocument(): void {
    if (this.isNewRecord) {
      // добавляем
      this.documentService.sendDocument(this.editedDocument).subscribe(data => {
        this.statusMessage = 'Данные успешно добавлены',
          this.loadDocuments();
      }, error => {
        this.statusMessage = 'Ошибка добавления!',
          this.loadDocuments();
      });
      this.isNewRecord = false;
      this.editedDocument = null;
    } else {
      // изменяем
      this.documentService.updateDocument(this.editedDocument).subscribe(data => {
        this.statusMessage = 'Данные успешно обновлены',
          this.loadDocuments();
        this.child.loadData();
      }, error => {
        this.statusMessage = 'Ошибка изменения! ',
          this.loadDocuments();
      });
      this.editedDocument = null;
    }
  }

  // отмена редактирования
  cancel(): void {
    // если отмена при добавлении, удаляем последнюю запись
    if (this.isNewRecord) {
      this.documents.pop();
      this.isNewRecord = false;
    }
    this.editedDocument = null;
  }

  // удаление
  deleteDocument(role: DocumentModel): void {
    console.log('delete');
    // this.documentService.deleteRole(role?.roleId).subscribe(data => {
    //   this.statusMessage = 'Данные успешно удалены',
    //     this.loadDocuments();
    // }, error => {
    //   this.statusMessage = 'Ошибка удаления роли! Роль не удалена.',
    //     this.loadDocuments();
    // });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalWindowComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.documentService.sendDocument(result).subscribe(() => this.loadDocuments());
      this.child.loadData();
    });
  }
}
