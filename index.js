const net = require('net');
const controller = require('./controller');
const commands = require('./commands');
const { raw } = require('mysql2');

const PORT = 1337;

const clients = [];

const server = net.createServer(async function (socket) {
    const clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log('Connected:', clientAddress);

    clients.push(socket);

    let dataBuffer = "";

    socket.on('data', async function (chunk) {
        dataBuffer += chunk.toString();
        if (dataBuffer.endsWith('\r\n')) {
            console.debug(`Received data from ${clientAddress}: ${dataBuffer}`);
            const request = JSON.parse(dataBuffer);
            const response = await controller.process(request);

            console.log(response);

            socket.write(JSON.stringify(response));
            socket.write('\n');

            if (request.command === commands.SEND_MESSAGE) {
                notifyClientsAboutNewMessage();
            }

            if (request.command === commands.BLOCK_USER) {
                notifyClientsAboutBlockedUser(request.data.id);
            }

            if (request.command === commands.DELETE_USER) {
                notifyClientsAboutDeleteUser(request.data.id);
            }
            dataBuffer = "";
        }
    });

    socket.on('close', function (hadError) {
        if (hadError) {
            console.log(`Client ${clientAddress} disconnected with error.`);
        } else {
            console.log(`Client ${clientAddress} disconnected gracefully.`);
        }
    });

    socket.on('error', function (err) {
        if (err.code === 'ECONNRESET') {
            console.error(`Connection of client ${clientAddress} is terminated`);
        } else {
            console.error(`Unexpected error with client ${clientAddress}:`, err);
        }

        socket.destroy();
    });
});

function notifyClientsAboutNewMessage() {
    clients.forEach(client => {
        client.write(JSON.stringify({ command: commands.PULL_MESSAGES }));
        client.write('\n');
    });
}

function notifyClientsAboutBlockedUser(userId) {
    clients.forEach(client => {
        client.write(JSON.stringify({ command: commands.USER_BLOCKED, data: { userId } }));
        client.write('\n');
    });
}

function notifyClientsAboutDeleteUser(userId) {
    clients.forEach(client => {
        client.write(JSON.stringify({ command: commands.USER_DELETED, data: { userId } }));
        client.write('\n');
    });
}

server.listen(PORT, '127.0.0.1');

console.log('Server started, listening connections on port ' + PORT);