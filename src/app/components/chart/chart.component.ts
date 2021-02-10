import {Component, Input, OnInit} from '@angular/core';
import {DocumentService} from '../../service/document.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  chartType = 'line';
  // chartDatasets: Array<any> = [];
  // chartLabels: Array<any> = [];
  isLoad = false;
  chartOptions = {responsive: true};
  chartColors = [
    {
      backgroundColor: 'rgba(105, 0, 132, .2)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(0, 137, 132, .2)',
      borderColor: 'rgba(0, 10, 130, .7)',
      borderWidth: 2,
    }
  ];

  public loadData(): void {
    const setLabel = new Set();
    this.chartDatasets = [];
    this.documentService.getDataset().subscribe(res => {
      // получили массив лейблов
      console.log(res);
      res.forEach((item) => {
        for (var key in item) {
          // console.log(item[key]);
          if (item[key].date !== undefined) {
            setLabel.add(item[key].date);
          }
          // this.datesLabels.push(item[key].date);
        }
        this.chartLabels = Array.from(setLabel).sort();
      });

      res.forEach((item) => {
        const datasetItem = {data: [], label: ''};
        for (var key in item) {
          console.log(item[key]);
          datasetItem.data.push(item[key].price);
          datasetItem.label = item[key].company;
        }
        this.chartDatasets.push(datasetItem);
        // this.datesLabels = Array.from(setLabel);
      });
      console.log(this.chartDatasets);
      this.isLoad = true;
    });


  }


  ngOnInit(): void {
    this.loadData();
  }

  constructor(private documentService: DocumentService) {
  }


  public chartDatasets: Array<any> = [];
  // [
  //   {data: [65, 59, 80, 81, 56, 55, 40], label: 'My First dataset'},
  //   {data: [28, 48, 40, 19, 86, 27, 90], label: 'My Second dataset'}
  // ];

  public chartLabels: Array<any> = [];

  // ['January', 'February', 'March', 'April', 'May', 'June', 'July'];


  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }


}
