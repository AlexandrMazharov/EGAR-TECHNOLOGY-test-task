import {Component, OnInit} from '@angular/core';
import {DocumentService} from '../../service/document.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  chartType = 'line';
  public chartDatasets: Array<any> = [];
  public chartLabels: Array<any> = [];
  chartOptions = {responsive: true};
  chartColors = [
    {
      backgroundColor: 'rgba(238,21,21,0.2)',
      borderColor: 'rgba(241,10,10,0.7)',
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
      res.forEach((item) => {
        for (let key in item) {
          if (item[key].date !== undefined) {
            setLabel.add(item[key].date);
          }
        }
        this.chartLabels = Array.from(setLabel).sort();
      });

      res.forEach((item) => {
        const datasetItem = {data: [], label: ''};
        for (const key in item) {
          datasetItem.data.push(item[key].price);
          datasetItem.label = item[key].company;
        }
        this.chartDatasets.push(datasetItem);
      });
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  constructor(private documentService: DocumentService) {
  }

  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }

}
