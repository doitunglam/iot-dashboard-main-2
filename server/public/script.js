const socket = io();

const waterHeightCtx = document.getElementById('waterHeightChart').getContext('2d');
const temperatureCtx = document.getElementById('temperatureChart').getContext('2d');
const rainCtx = document.getElementById('rainChart').getContext('2d');
const damLevelCtx = document.getElementById('damLevelChart').getContext('2d');

const waterHeightChart = new Chart(waterHeightCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Water Height (cm)',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false
        }]
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'minute'
                },
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Water Height (cm)'
                }
            }
        }
    }
});

const temperatureChart = new Chart(temperatureCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false
        }]
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'minute'
                },
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Temperature'
                }
            }
        }
    }
});


const rainChart = new Chart(rainCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Rain (cm)',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false
        }]
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'minute'
                },
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Rain (cm)'
                }
            }
        }
    }
});

const damLevelChart = new Chart(damLevelCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Dam Level (cm)',
            data: [],
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: false,
            stepped: true
        }]
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'minute'
                },
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Dam Level'
                },
                ticks: {
                    stepSize: 20,
                    callback: function(value) {
                        return value + 'cm';
                    }
                }
            }
        }
    }
});

socket.on('waterHeight', (data) => {
    const now = new Date(data.timestamp);
    if (waterHeightChart.data.labels.length >= 20) {
        waterHeightChart.data.labels.shift();
        waterHeightChart.data.datasets[0].data.shift();
    }
    waterHeightChart.data.labels.push(now);
    waterHeightChart.data.datasets[0].data.push(data.height);
    waterHeightChart.update();
});

socket.on('temperature', (data) => {
    const now = new Date(data.timestamp);
    if (temperatureChart.data.labels.length >= 20) {
        temperatureChart.data.labels.shift();
        temperatureChart.data.datasets[0].data.shift();
    }
    temperatureChart.data.labels.push(now);
    temperatureChart.data.datasets[0].data.push(data.temperature);
    temperatureChart.update();
});

socket.on('rain', (data) => {
    const now = new Date(data.timestamp);
    if (rainChart.data.labels.length >= 20) {
        rainChart.data.labels.shift();
        rainChart.data.datasets[0].data.shift();
    }
    rainChart.data.labels.push(now);
    rainChart.data.datasets[0].data.push(data.rain);
    rainChart.update();
});

socket.on('damStatus', (data) => {
    const now = new Date();
    if (damLevelChart.data.labels.length >= 20) {
        damLevelChart.data.labels.shift();
        damLevelChart.data.datasets[0].data.shift();
    }
    damLevelChart.data.labels.push(now);
    damLevelChart.data.datasets[0].data.push(data.level);
    damLevelChart.update();
});
