# Binance Price Notifier Chrome Extension (Crypto Price Notifier)

![Logo](readme%2Flogo.png)

## Overview

Binance Price Notifier is a Chrome extension that allows users to set up price alerts for various cryptocurrencies. The extension periodically checks the prices from Binance's ticker API and notifies the user when the set conditions are met. Users can manage their alerts with ease using the extension's inline editing and notification features.

## Features

### Version 1.0

- **Setup Price Alerts**: Users can set up alerts for specific cryptocurrencies against other coins(default USDT) (e.g., BTC/USDT).
- **Periodic Price Check**: Prices are checked every 5 minutes using Binance's ticker API.
- **Chrome Notifications**: Get notified when the price meets the specified conditions (up or down).
- **Notification Count**: The extension icon displays the number of price meets.
- **Disable Notifications**: Users can disable notifications using the switch in the upper right.
- **Stop Price Checking**: Users can stop all price checks using the switch in the upper left.
- **Inline Editing**: Users can edit alert conditions directly in the table.
- **Delete Alerts**: Users can delete alerts using the delete icon in the table.
- **Data Management**: Users can refresh the table, download data as a JSON file, and upload data from a JSON file.

### Version 1.1

#### Updates

- **Label Changes**: Improved labels for better clarity and user understanding.
- **Layout Changes**: Enhanced layout for a more user-friendly and visually appealing interface.
- **Reached Row Highlight**: Highlight rows in the table when price conditions are met for easier visibility.

#### New Features

- **Add Current Price Along with Coin**: Display the current price of the coin alongside the coin name for quick reference.
- **Add Last Price Synced Date Time**: Display the last price list checked date time.

![1.png](readme%2Fv1.1.png)

## Installation

### ➔ From the Chrome Web Store

Install the extension directly from the Chrome Web Store:

[Binance Price Notifier - Chrome Web Store](https://chrome.google.com/webstore/detail/<extension-id>)

### ➔ From GitHub

1. Download the zipped extension folder from the repository:
   [Download Binance Price Notifier Extension](https://github.com/Reshanpubudu5/crypto-price-notifier/blob/RE-1.1/extension/releases/download/v1.1/crypto-price-notifier-v1.1.zip)

2. Extract the downloaded zip file.

3. Load the extension in Chrome:

- Open Chrome and go to `chrome://extensions/`
- Enable "Developer mode" (top right)
- Click "Load unpacked" and select the extracted folder from the downloaded zip file

### ➔ Developer Installation

#### Prerequisites

- Node.js v20 or higher
1. Clone the repository:
    ```bash
    git clone git remote add origin https://github.com/Reshanpubudu5/crypto-price-notifier.git
    cd crypto-price-notifier/extension
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Build the project:
    ```bash
    npm run build
    ```

4. Load the extension in Chrome:
  - Open Chrome and go to `chrome://extensions/`
  - Enable "Developer mode" (top right)
  - Click "Load unpacked" and select the `dist\extension\browser` folder from the project

## Usage

1. **Add a Price Alert**: Fill in the "Coin", "Against", "Condition", and "Value" fields and click "Add".
2. **Manage Alerts**: Use the inline editing features to modify alerts or click the delete icon to remove an alert.
3. **Notification Control**: Use the switches in the upper right to enable/disable notifications and price checks.
4. **Data Management**: Use the refresh button to update the table, the download button to export data as JSON, and the upload button to import data from a JSON file.

## Configuration

### Chrome Storage

The extension uses Chrome's storage to persist alert configurations. Settings are automatically saved and restored when the extension is loaded.

### API Integration

The extension fetches prices using Binance's ticker API:
```plaintext
https://api.binance.com/api/v3/ticker/price
