# Cryptocurrency Price Notifier

------------

## Overview

This project consists of two main components:

1. **Binance Price Notifier Chrome Extension**
2. **Cryptocurrency Price Alerts Server**

### Binance Price Notifier Chrome Extension

The Chrome extension allows users to set up price alerts for specific cryptocurrencies against other coins (default
USDT). It periodically checks prices using Binance's ticker API and provides notifications when the set conditions are
met.

#### Key Features:

- Setup Price Alerts
- Periodic Price Check
- Chrome Notifications
- Data Management

For detailed instructions and features, please refer to the [Binance Price Notifier Chrome Extension](extension).

### Cryptocurrency Price Alerts Server

The server application monitors cryptocurrency prices on Binance and sends email notifications when the prices meet
specified conditions. It uses Flask for the web interface, APScheduler for periodic task scheduling, and Gmail for
sending email notifications.

#### Key Features:

- Monitor cryptocurrency prices on Binance
- Send email notifications based on price conditions
- Web interface to manage monitored coins
- Log errors and events

For detailed instructions and features, please refer to the [Cryptocurrency Price Alerts Server](server).
