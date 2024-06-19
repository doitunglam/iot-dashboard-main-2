const express = require("express");
const http = require("http");
const mqtt = require("mqtt");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// MQTT broker URL and options
const brokerUrl = "mqtt://localhost:1883";
const options = {
  clientId: "mqtt_web_server",
  username: "your-username", // If your broker requires authentication
  password: "your-password", // If your broker requires authentication
};

// Create MQTT client and connect
const client = mqtt.connect(brokerUrl, options);

// MQTT topics
const waterHeightTopic = "sensor/water_height";
const damControlTopic = "dam/control";

let currentDamLevel = 0; // Initial dam level

// Define dam levels
const damLevels = [0, 20, 40, 60, 80, 100];

// Handle MQTT connection
client.on("connect", () => {
  console.log("Connected to MQTT broker");
  client.subscribe(waterHeightTopic, (err) => {
    if (!err) {
      console.log(`Subscribed to topic: ${waterHeightTopic}`);
    }

    setInterval(() => {
      io.emit("damStatus", { level: currentDamLevel });
    }, 1000);
  });
});

// Handle incoming MQTT messages
client.on("message", (topic, message) => {
  if (topic === waterHeightTopic) {
    const data = JSON.parse(message.toString());
    io.emit("waterHeight", data);

    // Determine appropriate dam level based on water height
    let newDamLevel;
    if (data.height > 80) {
      newDamLevel = 100;
    } else if (data.height > 60) {
      newDamLevel = 80;
    } else if (data.height > 40) {
      newDamLevel = 60;
    } else if (data.height > 20) {
      newDamLevel = 40;
    } else if (data.height > 0) {
      newDamLevel = 20;
    } else {
      newDamLevel = 0;
    }
    // Control the dam if the level needs to be changed
    if (newDamLevel !== currentDamLevel) {
      currentDamLevel = newDamLevel;
      client.publish(
        damControlTopic,
        JSON.stringify({ level: currentDamLevel })
      );
      console.log(
        `Dam level set to ${currentDamLevel} due to water height ${data.height}`
      );
    }
  }
});

// Serve static files
app.use(express.static("public"));

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
