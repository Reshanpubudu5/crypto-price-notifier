import {Component, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CoinListTableComponent} from "./coin-list-table/coin-list-table.component";
import {ChromeStorageService} from "./service/chrome-storage.service";
import {COIN_LIST} from "./util";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, FormsModule, CoinListTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  @ViewChild("coinListTableComponent")
  coinListTableComponent: CoinListTableComponent = {} as CoinListTableComponent

  newRecord = {
    coin: '',
    against: 'USDT',
    condition: 'U',
    value: null
  };

  constructor(protected storageService: ChromeStorageService) {
  }

  addRecord() {
    this.storageService.get(COIN_LIST).then(coinList => {
      coinList = coinList?? [];
      coinList.push({...this.newRecord})

      this.storageService.set(COIN_LIST, coinList).then(() => {
        this.newRecord = {coin: '', against: 'USDT', condition: 'U', value: null};
        this.coinListTableComponent.loadData();
      })
    })
  }

  refreshTable() {
    this.coinListTableComponent.loadData();
  }

  exportData() {
    // Implement data export logic here
  }

  importData(event: any) {
    // Implement data import logic here
  }
}
