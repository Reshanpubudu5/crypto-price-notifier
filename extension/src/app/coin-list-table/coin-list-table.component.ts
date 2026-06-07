import {Component, OnInit} from '@angular/core';
import type {TabulatorFull} from 'tabulator-tables';
import {ChromeStorageService} from "../service/chrome-storage.service";
import {COIN_LIST} from "../util";
import {CoinDataDto} from "../dto/coin-data-dto";

type TabulatorConstructor = typeof TabulatorFull;

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
      void this.drawTable(data ?? []);
    });
  }

  private async drawTable(dataList: CoinDataDto[]): Promise<void> {
    const { TabulatorFull: Tabulator } = await import('tabulator-tables');
    this.initTable(Tabulator, dataList);
  }

  private initTable(Tabulator: TabulatorConstructor, dataList: CoinDataDto[]): void {
    const table = new Tabulator('#coin-table', {
      layout: 'fitColumns',
      columns: [
        {title: '', field: 'id', formatter: 'rownum', maxWidth: 20},
        {
          title: 'Coin', field: 'coin', editor: 'input',
          formatter: (cell: any) => {
            const row = cell.getRow().getData();

            if (!row.currentValue) {
              return cell.getValue();
            }
            return `${cell.getValue()} (${row.currentValue})`;
          },
          minWidth: 130,
          maxWidth: 400
        },
        {title: 'Pair', field: 'against', editor: 'input'},
        {
          title: 'Alert Type', field: 'condition', editor: 'list',
          editorParams: {values: {'U': 'UP', 'D': 'DOWN'}},
          formatter: 'lookup',
          formatterParams: {'U': 'UP', 'D': 'DOWN'}
        },
        {title: 'Value', field: 'value', editor: 'number', editorParams: {step: 0.0000001}},
        {
          title: '', field: 'actions', maxWidth: 20,
          formatter: () => {
            const deleteIcon = document.createElement('img');
            deleteIcon.src = 'assets/images/delete.svg';
            deleteIcon.className = 'delete-row-icon';
            deleteIcon.alt = 'Delete row';
            return deleteIcon;
          }
        }
      ],
      rowFormatter: (row) => {
        if (row.getData()['alert']) {
          row.getElement().classList.add('alert-row');
        }
      },
      data: dataList
    });

    table.on('cellClick', (_event, cell) => {
      if (cell.getColumn().getField() !== 'actions') {
        return;
      }

      const row = cell.getRow().getData();
      const index = dataList.findIndex(data => data.guid === row['guid']);
      if (index === -1) {
        return;
      }

      dataList.splice(index, 1);
      this.storageService.set(COIN_LIST, dataList).then(() => {
        table.setData(dataList).then();
      });
    });

    table.on('cellEdited', (cell: any) => {
      const row = cell.getRow().getData();
      const coinData = dataList.find(data => data.guid === row.guid);

      if (coinData) {
        coinData.coin = row.coin;
        coinData.against = row.against;
        coinData.condition = row.condition;
        coinData.value = row.value;

        this.storageService.set(COIN_LIST, dataList).then(() => {
          table.setData(dataList).then();
        });
      }
    })
  }

}
