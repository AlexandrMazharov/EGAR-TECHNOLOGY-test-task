import {Component, OnInit} from '@angular/core';
import {DocumentModel} from '../../models/document.model';
import {ECompany} from '../../models/ECompany';

@Component({
  selector: 'app-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.css']
})
export class ModalWindowComponent {
  public document: DocumentModel;
  public company: Array<string>;
  constructor() {
    this.document = new DocumentModel();
    this.getCompany();
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



}
