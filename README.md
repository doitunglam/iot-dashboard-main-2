# iot-dashboard

**Setup and Usage**

Download Mosquito MQTT Broker: https://mosquitto.org/download/

Download NodeJS: https://nodejs.org/en

**Start Broker**

Sau khi cài đặt, di chuyển đến thư mục cài đặt Mosquitto và nhập lệnh sau

./mosquitto -v 

để khởi chạy broker

Từ gốc thư mục, tạo 3 terminal

**Terminal 1**

cd actuator

npm install

npm run start

**Terminal 2**

cd sensor

npm install

npm run start

**Terminal 3**

cd server

npm install

npm run start

Sau đó, truy cập vào địa chỉ http://localhost:3000 