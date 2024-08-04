import {Component, OnInit, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CoinListTableComponent} from "./coin-list-table/coin-list-table.component";
import {ChromeStorageService} from "./service/chrome-storage.service";
import {COIN_LIST, ENABLE_CHECK_PRICE, ENABLE_NOTIFICATION, LAST_FETCH} from "./util";
import {CoinDataDto} from "./dto/coin-data-dto";
import {formatDate, NgIf} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, FormsModule, CoinListTableComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  @ViewChild("coinListTableComponent")
  coinListTableComponent: CoinListTableComponent = {} as CoinListTableComponent

  newRecord: CoinDataDto = {guid: this.generateUniqueId, coin: '', against: 'USDT', condition: 'U', value: 0, alert: false};

  enabledCheckPrices: boolean = true;
  enabledDesktopNotifications: boolean = true;
  lastFetchDateTime: Date | null = null;
  lastFetchDateTimeFormatted: string = '';

  constructor(protected storageService: ChromeStorageService) {
  }

  get generateUniqueId(): string {
    const randomNum = Math.floor(Math.random() * 10000000000);
    return `${Date.now()}${randomNum}`;
  }

  ngOnInit(): void {
    // Initialize switch statuses based on stored values
    this.storageService.get(ENABLE_CHECK_PRICE)?.then(value => {
      this.enabledCheckPrices = value ?? true;
    });

    this.storageService.get(ENABLE_NOTIFICATION)?.then(value => {
      this.enabledDesktopNotifications = value ?? true;
    });

    this.getLastFetchDateTime();
    // fetch last synced date time in every 1min
    setInterval(this.getLastFetchDateTime.bind(this), 1000 * 60);
  }

  addRecord() {
    if (!this.newRecord || !this.newRecord.coin || this.newRecord.coin.length < 1
      || !this.newRecord.against || this.newRecord.against.length < 1
      || !this.newRecord.value) {
      return;
    }

    this.storageService.get(COIN_LIST).then(coinList => {
      coinList = coinList ?? [];
      coinList.push({...this.newRecord})

      this.storageService.set(COIN_LIST, coinList).then(() => {
        this.newRecord = {guid: this.generateUniqueId, coin: '', against: 'USDT', condition: 'U', value: 0, alert: false};
        this.coinListTableComponent.loadData();
      })
    })
  }

  refreshTable() {
    this.coinListTableComponent.loadData();
  }

  exportData(): void {
    this.storageService.get(COIN_LIST).then(coinList => {
      coinList = coinList ?? [];

      const dataStr = JSON.stringify(coinList, null, 2);
      const blob = new Blob([dataStr], {type: 'application/json'});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'coin_data.json';
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }

  importData(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          if (Array.isArray(jsonData)) {
            const coinList = jsonData.map(item => ({
              guid: item.guid ?? this.generateUniqueId,
              coin: item.coin,
              against: item.against,
              condition: item.condition,
              value: item.value,
              currentValue: null,
              alert: false
            }));
            this.storageService.set(COIN_LIST, coinList).then(() => this.refreshTable);
          } else {
            alert('Invalid JSON format');
          }
        } catch (error) {
          console.error('Error parsing JSON file:', error);
        }
      };
      reader.readAsText(file);
    }
  }

  toggleCheckPrices(): void {
    this.storageService.set(ENABLE_CHECK_PRICE, this.enabledCheckPrices)?.then();
  }

  toggleSendNotifications(): void {
    this.storageService.set(ENABLE_NOTIFICATION, this.enabledDesktopNotifications)?.then();
  }

  getLastFetchDateTime(): void {
    this.storageService.get(LAST_FETCH).then(value => {
      this.lastFetchDateTime = value
      this.lastFetchDateTimeFormatted = this.formatDateTime(value);
    })
  }

  formatDateTime(date: Date): string {
    if (!date) {
      return '';
    }

    try {
      const fetchDate = new Date(date);
      if (isNaN(fetchDate.getTime())) {
        return '';
      }

      const now = new Date();
      const isSameDay = now.toDateString() === fetchDate.toDateString();

      if (isSameDay) {
        return formatDate(fetchDate, 'hh:mm a', 'en-US');
      } else {
        return formatDate(fetchDate, 'dd MMM yyyy hh:mm a', 'en-US');
      }
    } catch (error) {
      return '';
    }
  }
}
