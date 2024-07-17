import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {ChromeStorageService} from "../service/chrome-storage.service";
import {COIN_LIST} from "../util";

@Component({
  selector: 'app-coin-list-table',
  standalone: true,
  imports: [],
  templateUrl: './coin-list-table.component.html',
  styleUrl: './coin-list-table.component.scss'
})
export class CoinListTableComponent implements OnInit {
  // @Input() tableData: any[] = [];
  // @Input() columnNames: any[] = [];
  // @Input() height: string = '311px';
  // list properties you want to set per implementation here...

  // tab = document.createElement('div');

  constructor(protected storageService: ChromeStorageService) {
    // this.tableData = [
    //   {
    //     'against': 'USDT',
    //     'coin': 'FTM',
    //     'condition': 'U',
    //     'value': 0.75
    //   },
    //   {
    //     'against': 'USDT',
    //     'coin': 'VET',
    //     'condition': 'U',
    //     'value': 0.75
    //   },
    //   {
    //     'against': 'USDT',
    //     'coin': 'BAKE',
    //     'condition': 'U',
    //     'value': 1.4
    //   },
    //   {
    //     'against': 'USDT',
    //     'coin': 'BSW',
    //     'condition': 'U',
    //     'value': 1.75
    //   },
    //   {
    //     'against': 'USDT',
    //     'coin': 'ZIL',
    //     'condition': 'U',
    //     'value': 0.06
    //   },
    //   {
    //     'against': 'USDT',
    //     'coin': 'MTL',
    //     'condition': 'U',
    //     'value': 2.7
    //   },
    //   {
    //     'against': 'USDT',
    //     'coin': 'ALPINE',
    //     'condition': 'U',
    //     'value': 1.85
    //   },
    //   {
    //     'against': 'USDT',
    //     'coin': 'GMT',
    //     'condition': 'U',
    //     'value': 0.25
    //   },
    //   {
    //     'against': 'USDT',
    //     'coin': 'FTT',
    //     'condition': 'U',
    //     'value': 5.1
    //   },
    //   {
    //     'against': 'USDT',
    //     'coin': 'VGX',
    //     'condition': 'U',
    //     'value': 0.55
    //   },
    //   {
    //     'against': 'USDT',
    //     'coin': 'HIGH',
    //     'condition': 'U',
    //     'value': 4.6
    //   },
    //   {
    //     'against': 'USDT',
    //     'coin': 'OAX',
    //     'condition': 'U',
    //     'value': 0.2
    //   },
    //   {
    //     'against': 'USDT',
    //     'coin': 'PEPE',
    //     'condition': 'U',
    //     'value': 1.2e-05
    //   },
    //   {
    //     'against': 'USDT',
    //     'coin': 'ASTR',
    //     'condition': 'U',
    //     'value': 0.21
    //   },
    //   {
    //     'against': 'USDT',
    //     'coin': 'ETH',
    //     'condition': 'U',
    //     'value': 3500.0
    //   },
    //   {
    //     'against': 'USDT',
    //     'coin': 'ETH',
    //     'condition': 'D',
    //     'value': 3000.0
    //   },
    //   {
    //     'against': 'USDT',
    //     'coin': 'BTC',
    //     'condition': 'D',
    //     'value': 60000.0
    //   },
    //   {
    //     'against': 'USDT',
    //     'coin': 'BTC',
    //     'condition': 'U',
    //     'value': 63000.0
    //   },
    //   {
    //     'against': 'USDT',
    //     'coin': 'FTT',
    //     'condition': 'U',
    //     'value': 1.5
    //   }
    // ]

    // storageService.set('coinList', this.tableData);
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.storageService.get(COIN_LIST).then(data => {
        this.drawTable(data);
    });
  }

  private drawTable(data: any[]): void {
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
              const row = cell.getRow();
              // this.disableDeleteButtons(true);
              // $.post('/delete', {id: row.getIndex() - 1}, () => {
              //   this.loadData(table);
              //   this.disableDeleteButtons(false);
              // });
            };
            return deleteBtn;
          }
        }
      ],
      // cellEdited: (cell: any) => {
      //   const row = cell.getRow().getData();
        // $.post('/update', {
        //   id: row.id - 1,
        //   coin: row.coin,
        //   against: row.against,
        //   condition: row.condition,
        //   value: row.value
        // });
      // },
      data: data
    });
  }

}
