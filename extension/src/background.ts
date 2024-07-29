const COIN_LIST = 'COIN_LIST'; // same as src/app/util.ts
const ENABLE_CHECK_PRICE = 'ENABLE_CHECK_PRICE';
const ENABLE_NOTIFICATION = 'ENABLE_NOTIFICATION';

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  showNotification('Extension installed', 'The Binance Price Notifier extension has been installed.');
  chrome.alarms.create('priceCheckAlarm', {periodInMinutes: 1 / 2}).then();
});

chrome.alarms.onAlarm.addListener((alarm): void => {
  if (alarm.name === 'priceCheckAlarm') {
    checkPricesAndNotify().then();
  }
});

async function checkPricesAndNotify() {
  getData(ENABLE_CHECK_PRICE).then(async enableCheckPrice => {
    if (!enableCheckPrice) {
      return;
    }

    try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/price');
      const priceList: [{ symbol: string; price: string }] = await response.json();

      await getCoinList().then(coinList => {

        coinList?.forEach((coin: { against: string; coin: string; condition: string; value: number }) => {
          const priceDetail = priceList.find(details => details.symbol === (coin.coin + coin.against))

          if (priceDetail) {
            const currCoinPrice = parseFloat(priceDetail.price);

            // Calculate the price difference and percentage change
            const priceDiff = currCoinPrice - coin.value;
            const percentageChange = (priceDiff / coin.value) * 100;

            // Determine if a notification should be shown
            if (coin.condition === 'U' || coin.condition === 'UP') {
              if (currCoinPrice >= coin.value) {
                const subject = `Binance Alert-${coin.coin} (UP by ${percentageChange.toFixed(2)}%)`;
                const message = `The current ${coin.coin}/${coin.against} price is: ${currCoinPrice} (UP by ${percentageChange.toFixed(2)}%)`;
                showNotification(subject, message);
                setCountOnLogo(subject, message);
              }
            }

            if (coin.condition === 'D' || coin.condition === 'DOWN') {
              if (currCoinPrice <= coin.value) {
                const subject = `Binance Alert-${coin.coin} (DOWN by ${percentageChange.toFixed(2)}%)`;
                const message = `The current ${coin.coin}/${coin.against} price is: ${currCoinPrice} (DOWN by ${percentageChange.toFixed(2)}%)`;
                showNotification(subject, message);
                setCountOnLogo(subject, message);
              }
            }
          }
        })
      })
    } catch (error) {
      console.error('Error fetching price data:', error);
    }
  });
}

function showNotification(title: string, message: string) {
  getData(ENABLE_NOTIFICATION).then(async enableNotification => {
    if (!enableNotification) {
      return;
    }

    chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.runtime.getURL('assets/images/favicon-16.png'), // Correctly reference the icon path
      title: title,
      message: message,
      priority: 2
    });
  });
}

function setCountOnLogo(title: string, message: string) {
  chrome.action.setBadgeText({text: `${Math.random()}`}).then();
}

async function getCoinList(): Promise<[{ against: string; coin: string; condition: string; value: number }]> {
  return await getData(COIN_LIST);
}

async function getData(key: string): Promise<any> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([key], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[key]);
      }
    });
  });
}
