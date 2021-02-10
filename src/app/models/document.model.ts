export class DocumentModel {
  private _id: number;
  private _date: string;
  private _company: string;
  private _price: number;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }

  constructor() {
  }

  // constructor(id: number, date: string, company: string, price: number) {
  //   this._id = id;
  //   this._date = date;
  //   this._company = company;
  //   this._price = price;
  // }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get date(): string {
    return this._date;
  }

  set date(value: string) {
    this._date = value;
  }

  get company(): string {
    return this._company;
  }

  set company(value: string) {
    this._company = value;
  }

  get price(): number {
    return this._price;
  }

  set price(value: number) {
    this._price = value;
  }
}
