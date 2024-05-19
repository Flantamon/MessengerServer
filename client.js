const net = require('net');
const crypto = require("crypto");

// Конфигурация соединения
const client = new net.Socket();
const PORT = 1337;
const HOST = '127.0.0.1';

const getUsersCommand = {
    requestId: crypto.randomBytes(16).toString("hex"),
    command: 'authenticate',
    data: {
        email: 'admin',
        password: '1111',
    }
}

client.connect(PORT, HOST, function() {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // Отправляем сообщение на сервер
    client.write(JSON.stringify(getUsersCommand));
});

// Получаем данные от сервера
client.on('data', function(data) {
    console.log('DATA: ' + data);
    // Полностью закрываем соединение после получения данных
    client.destroy();
});

// Слушаем событие закрытия соединения
client.on('close', function() {
    console.log('Connection closed');
});

// Обрабатываем возможные ошибки
client.on('error', function(err) {
    console.error('Connection error: ', err);
});
