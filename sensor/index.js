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
const waterHeightTopic = "sensor/water_height";
const temperatureTopic = "sensor/temperature";
const rainTopic = "sensor/rain";

// Function to generate a random height value
function generateHeight(baseWaterHeight) {
  const fluctuationRatio = 10;
  const baseHeightValue = baseWaterHeight.value; // Base height in centimeter
  const fluctuation = Math.random() * fluctuationRatio - fluctuationRatio / 2; // Random fluctuation between -2.5 and + 2.5 (height min value = 0)
  if (fluctuation + baseHeightValue < 0) {
    return 0;
  }
  return baseHeightValue + fluctuation;
}

// Function to publish a height value with a timestamp
function publishHeight(baseWaterHeight) {
  const height = generateHeight(baseWaterHeight);
  baseWaterHeight.value = height;
  const timestamp = new Date().toISOString();

  const data = {
    height: height.toFixed(2), // Format height to 2 decimal places
    timestamp: timestamp,
  };

  const message = JSON.stringify(data);

  client.publish(waterHeightTopic, message, { qos: 0 }, (err) => {
    if (err) {
      console.error("Failed to publish message:", err);
    } else {
      console.log("Published:", message);
    }
  });
}

// Function to generate a random temperature value
function generateTemperature(baseTemperature) {
  const fluctuationRatio = 1;
  const baseTemperatureValue = baseTemperature.value; // Base height in centimeter
  const fluctuation = Math.random() * fluctuationRatio - fluctuationRatio / 2;
  return baseTemperatureValue + fluctuation;
}

// Function to publish a temperature value with a timestamp
function publishTemperature(baseTemperature) {
  const temperature = generateTemperature(baseTemperature);
  baseTemperature.value = temperature;
  const timestamp = new Date().toISOString();

  const data = {
    temperature: temperature.toFixed(2), // Format temperature to 2 decimal places
    timestamp: timestamp,
  };

  const message = JSON.stringify(data);

  client.publish(temperatureTopic, message, { qos: 0 }, (err) => {
    if (err) {
      console.error("Failed to publish message:", err);
    } else {
      console.log("Published:", message);
    }
  });
}

// Function to generate a random rain value
function generateRain(baseRain) {
    const fluctuationRatio = 20;
    const baseHeightValue = baseRain.value; // Base rain in centimeter
    const fluctuation = Math.random() * fluctuationRatio - fluctuationRatio / 2; 
    if (fluctuation + baseHeightValue < 0) {
      return 0;
    }
    return baseHeightValue + fluctuation;
  }
  
  // Function to publish a rain value with a timestamp
  function publishRain(baseRain) {
    const rain = generateRain(baseRain);
    baseRain.value = rain;
    const timestamp = new Date().toISOString();
  
    const data = {
      rain: rain.toFixed(2), // Format rain to 2 decimal places
      timestamp: timestamp,
    };
  
    const message = JSON.stringify(data);
  
    client.publish(rainTopic, message, { qos: 0 }, (err) => {
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
    const baseTemperature = { value: 25 };
    const baseRain = { value: 0 };
    console.log("Connected to broker");

  // Publish a temperature value immediately
  publishHeight(baseHeight);
  publishRain(baseRain);
  publishTemperature(baseTemperature);

  setInterval(() => publishHeight(baseHeight), 1000);
  setInterval(() => publishRain(baseRain), 5000);
  setInterval(() => publishTemperature(baseTemperature), 2000);
});

// Handle errors
client.on("error", (err) => {
  console.error("Connection error:", err);
  client.end();
});
