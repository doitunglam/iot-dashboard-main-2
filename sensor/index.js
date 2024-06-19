const mqtt = require("mqtt");

// Replace with your MQTT broker's URL
const brokerUrl = process.env.MQTT_BROKER_URL || "mqtt://localhost:1883"; // Example: 'mqtt://localhost:1883' or 'mqtts://your-server-ip:8883'

// Options for connecting to the broker
const options = {
  clientId: "sensor",
  username: "sensor-username",
  password: "sensor-password",
};

// Create a client instance
const client = mqtt.connect(brokerUrl, options);

// Topic to publish to
const topic = "sensor/water_height";

// Function to generate a random temperature value
function generateHeight(baseWaterHeight) {
  const fluctuationRatio = 20;
  const baseHeightValue = baseWaterHeight.value; // Base height in centimeter
  const fluctuation = Math.random() * fluctuationRatio - fluctuationRatio / 2; // Random fluctuation between -2.5 and + 2.5 (height min value = 0)
  if (fluctuation + baseHeightValue < 0) {
    return 0;
  }
  return baseHeightValue + fluctuation;
}

// Function to publish a temperature value with a timestamp
function publishHeight(baseWaterHeight) {
  const height = generateHeight(baseWaterHeight);
  baseWaterHeight.value = height;
  const timestamp = new Date().toISOString();

  const data = {
    height: height.toFixed(2), // Format temperature to 2 decimal places
    timestamp: timestamp,
  };

  const message = JSON.stringify(data);

  client.publish(topic, message, { qos: 0 }, (err) => {
    if (err) {
      console.error("Failed to publish message:", err);
    } else {
      console.log("Published:", message);
    }
  });
}

// When the client connects to the broker
client.on("connect", () => {
  const baseHeight = { value: 0 };
  console.log("Connected to broker");

  // Publish a temperature value immediately
  publishHeight(baseHeight);

  // Set an interval to publish a temperature value every minute (60000 milliseconds)
  setInterval(() => publishHeight(baseHeight), 1000);
});

// Handle errors
client.on("error", (err) => {
  console.error("Connection error:", err);
  client.end();
});
