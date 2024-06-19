const mqtt = require('mqtt');

// MQTT broker URL and options
const brokerUrl = 'mqtt://localhost:1883';
const options = {
    clientId: 'mqtt_dam_actuator',
    username: 'your-username', // If your broker requires authentication
    password: 'your-password'  // If your broker requires authentication
};

// MQTT topic to subscribe to
const damControlTopic = 'dam/control';

// Create MQTT client and connect
const client = mqtt.connect(brokerUrl, options);

// Handle MQTT connection
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(damControlTopic, (err) => {
        if (!err) {
            console.log(`Subscribed to topic: ${damControlTopic}`);
        }
    });
});

// Handle incoming MQTT messages
client.on('message', (topic, message) => {
    if (topic === damControlTopic) {
        const controlMessage = JSON.parse(message.toString());
        setDamLevel(controlMessage.level);
    }
});

// Simulate setting the dam level
function setDamLevel(targetLevel) {
    console.log(`Setting dam level to ${level}`);
    // Add actual hardware control code here if needed
}
