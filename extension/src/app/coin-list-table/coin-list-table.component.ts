import {Component, OnInit} from '@angular/core';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {ChromeStorageService} from "../service/chrome-storage.service";
import {COIN_LIST} from "../util";
import {CoinDataDto} from "../dto/CoinDataDto";

@Component({
  selector: 'app-coin-list-table',
  standalone: true,
  imports: [],
  templateUrl: './coin-list-table.component.html',
  styleUrl: './coin-list-table.component.scss'
})
export class CoinListTableComponent implements OnInit {

  constructor(protected storageService: ChromeStorageService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.storageService.get(COIN_LIST).then(data => {
      this.drawTable(data);
    });
  }

  private drawTable(dataList: CoinDataDto[]): void {
    const table = new Tabulator('#coin-table', {
      layout: 'fitColumns',
      columns: [
        {title: 'ID', field: 'id', formatter: 'rownum'},
        {title: 'Coin', field: 'coin', editor: 'input'},
        {title: 'Against', field: 'against', editor: 'input'},
        {
          title: 'Condition', field: 'condition', editor: 'list',
          editorParams: {values: {'U': 'UP', 'D': 'DOWN'}},
          formatter: 'lookup',
          formatterParams: {'U': 'UP', 'D': 'DOWN'}
        },
        {title: 'Value', field: 'value', editor: 'number', editorParams: {step: 0.0000001}},
        {
          title: 'Actions', field: 'actions',
          formatter: (cell: any, formatterParams: any, onRendered: any) => {
            const deleteBtn = document.createElement('button');
            deleteBtn.innerText = 'Delete';
            deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm');
            deleteBtn.onclick = () => {
              const row = cell.getRow().getData();

              const index = dataList.findIndex(data => data.guid === row.guid);
              if (index !== -1) {
                dataList.splice(index, 1);

                // Update the storage with the modified dataList
                this.storageService.set(COIN_LIST, dataList).then(() => {
                  // Redraw the table with the updated dataList
                  table.setData(dataList).then();
                });
              }
            };
            return deleteBtn;
          }
        }
      ],
      data: dataList
    });

    table.on('cellEdited', (cell: any) => {
      const row = cell.getRow().getData();
      const coinData = dataList.find(data => data.guid === row.guid);

      if (coinData) {
        coinData.coin = row.coin;
        coinData.against = row.against;
        coinData.condition = row.condition;
        coinData.value = row.value;

        // Update the storage with the modified dataList
        this.storageService.set(COIN_LIST, dataList).then(() => {
          table.setData(dataList).then();
        });
      }
    })
  }

}
