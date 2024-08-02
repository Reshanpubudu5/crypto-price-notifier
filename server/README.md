# Cryptocurrency Price Alerts Script

------------------------
This Python script monitors cryptocurrency prices on Binance and sends email notifications when the prices meet specified conditions.
It uses Flask for the web interface, APScheduler for periodic task scheduling, and Gmail for sending email notifications.

### Features
* Monitor cryptocurrency prices on Binance
* Send email notifications based on price conditions
* Web interface to manage monitored coins
* Log errors and events

-----------------------------

# Installation Guide

**Pre-requisite:** Python should be installed on your server

1. Clone the repository:
    ```bash
    git clone git remote add origin https://github.com/Reshanpubudu5/crypto-price-notifier.git
    cd crypto-price-notifier
    ```

2. Install the required packages:
    ```bash
    pip install flask requests apscheduler
    ```

3. Create a JSON file `binance.json` to store the coin data with the following content:
    ```json
    []
    ```

4. Update the email credentials in the `send_email` function in [app.py](app.py):
    ```python
    from_email = 'your-email@gmail.com'
    from_password = 'your-email-password'
    ```

5. Ensure logging configuration in the script is correct (optional):
    ```python
    logging.basicConfig(filename='../app.log', level=logging.ERROR, format='%(asctime)s %(levelname)s: %(message)s')
    ```

6. Run the Flask application:
    ```bash
    python app.py
    ```

7. Access the web interface: Open your browser and go to `http://127.0.0.1:5000`

*Note: These steps may vary depending on your Python version and other conditions.*

-----------

# Usage

* Add, update, or delete monitored coins via the web interface.
* Bulk upload data via the `/upload` endpoint:
    ```bash
    curl -X POST -H "Content-Type: application/json" -d @data.json http://127.0.0.1:5000/upload
    ```
* View logs: Access `http://127.0.0.1:5000/logs`

### API Endpoints

* **GET** `/data`: Get all monitored coins
* **POST** `/add`: Add a new coin to monitor
* **POST** `/update`: Update an existing coin
* **POST** `/upload`: Bulk upload coin data
* **POST** `/delete`: Delete a coin
* **GET** `/logs`: View application logs

### Configuration

* **Email Configuration**: Update the email credentials in the `send_email` function.
* **Scheduler Interval**: Modify the interval for the scheduler in the `__main__` section.
