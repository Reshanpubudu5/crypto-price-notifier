import requests
import time
import json
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import Flask, request, jsonify, render_template, redirect, url_for
from apscheduler.schedulers.background import BackgroundScheduler

# binance price alert script

app = Flask(__name__)

def send_email(subject, body, to_email):
    from_email = 'adopt.me.vol@gmail.com'
    from_password = 'uaoh yckj xyrs jbzw'

    # Setup the MIME
    message = MIMEMultipart()
    message['From'] = from_email
    message['To'] = to_email
    message['Subject'] = subject

    # Attach the body with the msg instance
    message.attach(MIMEText(body, 'plain'))

    # Create SMTP session for sending the mail
    try:
        # Use Gmail's SMTP server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()  # Enable security
        server.login(from_email, from_password)  # Login with your email and password
        text = message.as_string()
        server.sendmail(from_email, to_email, text)
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")
    # finally:
    #     server.quit()

def send_notification_email(subject, body):
    to_email = "reshanpubudu5@gmail.com"
    send_email(subject, body, to_email)

def get_coin_price(coin, against):
    try:
        response = requests.get('https://api.binance.com/api/v3/ticker/price', params={
            'symbol': coin + against
        })
        data = response.json()
        return float(data['price'])
    except Exception as e:
        print(f"Failed to check price({coin}/{against}): {e}")
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
            print(f"Failed to read json file")
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
def data():
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
        return jsonify({"error": str(e)}), 500

@app.route('/delete', methods=['POST'])
def delete_record():
    data = load_data()
    record_id = int(request.form['id'])
    data.pop(record_id - 1)
    save_data(data)
    return redirect(url_for('index'))

if __name__ == '__main__':
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=process_coins, trigger="interval", seconds=900) # 15 min
    scheduler.start()

    try:
        app.run(debug=False)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()