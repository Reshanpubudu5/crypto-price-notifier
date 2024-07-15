import requests
import json
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import Flask, request, jsonify, render_template, redirect, url_for
from apscheduler.schedulers.background import BackgroundScheduler
import logging

# Configure logging
logging.basicConfig(filename='../app.log', level=logging.ERROR,
                    format='%(asctime)s %(levelname)s: %(message)s')

app = Flask(__name__)

def send_email(subject, body, to_emails):
    from_email = 'your@gmail.com'
    from_password = 'your password'

    # Setup the MIME
    message = MIMEMultipart()
    message['From'] = from_email
    message['To'] = ', '.join(to_emails)
    message['Subject'] = subject

    # Attach the body with the msg instance
    message.attach(MIMEText(body, 'plain'))

    # Create SMTP session for sending the mail
    try:
        # Use Gmail's SMTP server
        server = smtplib.SMTP('smtp.xxxx.com', 587)
        server.starttls()  # Enable security
        server.login(from_email, from_password)  # Login with your email and password
        text = message.as_string()
        server.sendmail(from_email, to_emails, text)
        print(f"Email sent to {to_emails}")
    except Exception as e:
        error_message = f"Failed to send email: {e}"
        print(error_message)
        logging.error(error_message)
    finally:
        server.quit()

def send_notification_email(subject, body):
    to_emails = ["youremail@gmail.com"]
    send_email(subject, body, to_emails)

def get_coin_price(coin, against):
    try:
        response = requests.get('https://api.binance.com/api/v3/ticker/price', params={
            'symbol': coin + against
        })
        data = response.json()
        return float(data['price'])
    except Exception as e:
        error_message = f"Failed to check price({coin}/{against}): {e}"
        print(error_message)
        logging.error(error_message)
        return -1

def process_coins():
    coin_list = load_data();

    # iterate over coin_list
    for coin_col in coin_list:
        curr_coin_price = get_coin_price(coin_col["coin"], coin_col["against"])

        # error occurred when read price for coin, then continue for next coin
        if curr_coin_price == -1:
            continue

        price_diff = curr_coin_price - coin_col["value"]
        percentage_change = (price_diff / coin_col["value"]) * 100

        if coin_col["condition"] in ["U", "UP"] and curr_coin_price >= coin_col["value"]:
            subject = f"Binance Alert-{coin_col['coin']} (UP by {percentage_change:.2f}%)"
            email_body = f"The current {coin_col['coin']}/{coin_col['against']} price is: {curr_coin_price} (UP by {percentage_change:.2f}%)";
            print(email_body)
            send_notification_email(subject, email_body)

        if coin_col["condition"] in ["D", "DOWN"] and curr_coin_price <= coin_col["value"]:
            subject = f"Binance Alert-{coin_col['coin']} (DOWN by {percentage_change:.2f}%)"
            email_body = f"The current {coin_col['coin']}/{coin_col['against']} price is: {curr_coin_price} (DOWN by {percentage_change:.2f}%)"
            print(email_body)
            send_notification_email(subject, email_body)

# Load data from JSON file
def load_data():
    with open('binance.json', 'r') as file:
        try:
            return json.load(file)
        except Exception as e:
            error_message = f"Failed to read json file: {e}"
            print(error_message)
            logging.error(error_message)
            return []

# Save data to JSON file
def save_data(data):
    with open('binance.json', 'w') as file:
        json.dump(data, file, indent=4)

@app.route('/')
def index():
    data = load_data()
    return render_template('index.html', data=data)

@app.route('/data', methods=['GET'])
def get_data():
    return load_data()

@app.route('/add', methods=['POST'])
def add_record():
    data = load_data()
    new_record = {
        "coin": request.form['coin'],
        "against": request.form['against'],
        "condition": request.form['condition'],
        "value": float(request.form['value'])
    }
    data.append(new_record)
    save_data(data)
    return redirect(url_for('index'))

@app.route('/update', methods=['POST'])
def update_record():
    data = load_data()
    record_id = int(request.form['id'])
    data[record_id] = {
        "coin": request.form['coin'],
        "against": request.form['against'],
        "condition": request.form['condition'],
        "value": float(request.form['value'])
    }
    save_data(data)
    return redirect(url_for('index'))

# bulk upload data
@app.route('/upload', methods=['POST'])
def upload_data():
    try:
        json_data = request.get_json()
        if json_data:
            with open('binance.json', 'w') as file:
                json.dump(json_data, file, indent=4)
            return jsonify({"message": "Data uploaded successfully"}), 200
        else:
            return jsonify({"error": "No JSON data received"}), 400
    except Exception as e:
        error_message = f"Failed to upload data: {e}"
        print(error_message)
        logging.error(error_message)
        return jsonify({"error": str(e)}), 500

@app.route('/delete', methods=['POST'])
def delete_record():
    data = load_data()
    record_id = int(request.form['id'])
    if record_id >= 0 and record_id < len(data):
        data.pop(record_id)
        save_data(data)
    return redirect(url_for('index'))

@app.route('/logs', methods=['GET'])
def get_logs():
    try:
        with open('../app.log', 'r') as file:
            logs = file.read()
        return logs, 200, {'Content-Type': 'text/plain; charset=utf-8'}
    except FileNotFoundError:
        return "Log file not found", 404
    except Exception as e:
        return f"Failed to read log file: {str(e)}", 500

if __name__ == '__main__':
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=process_coins, trigger="interval", seconds=1200) # 15 min
    scheduler.start()

    try:
        app.run(debug=False)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
