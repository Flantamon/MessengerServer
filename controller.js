const crypto = require('crypto');
const repository = require('./repository');
const commands = require('./commands');
const errors = require('./errors');
const { userRoles } = require('./constants');
const sendPasswordToEmail = require('./mailer');

const sessions = {};

function generatePassword() {
    return crypto.randomBytes(8).toString("hex");
}

async function authenticate(email, password) {
    const user = await repository.getUserByEmailAndPassword(email, password);

    if (!user || user.status === "blocked") {
        throw new Error('Not authenticated');
    }

    const sessionId = crypto.randomBytes(16).toString("hex");

    sessions[sessionId] = user;

    return sessionId;
}

function authorize(sessionId) {
    if (!sessions[sessionId]) {
        throw new Error('Not authorized');
    }
}

function authorizeAdmin(sessionId) {
    if (sessions[sessionId]?.role !== userRoles.ADMIN) {
        throw new Error('Not authorized');
    }
}

async function process(request) {
    const response = {
        requestId: request.requestId,
        sessionId: request.sessionId,
        command: request.command,
    };

    if (request?.command === commands.AUTHENTICATE) {
        try {
            const sessionId = await authenticate(request.data?.email, request.data?.password);

            response.data = { sessionId };
        } catch (e) {
            console.log(e)
            response.error = errors.AUTH_FAILED;
        }

        return response;
    }

    try {
        await authorize(request.sessionId);
    } catch {
        response.error = errors.NOT_AUTHORIZED;

        return response;
    }

    switch (request?.command) {
        case commands.GET_USERS:
            response.data = await repository.getUsers();
            return response;
        case commands.GET_MYDATA:
            response.data = sessions[request.sessionId];
            return response;
        case commands.GET_CHANNELS:
            response.data = await repository.getChannels();
            return response;
        case commands.GET_DIRECT_MESSAGES:
            response.data = await repository.getDirectMessages(sessions[request.sessionId].id, request.data?.interlocutorId);
            return response;
        case commands.GET_CHANNEL_MESSAGES:
            response.data = await repository.getChannelMessages(request.data?.channelId);
            return response;
        case commands.SEND_MESSAGE:
            await repository.sendMessage(
                request.data?.text,
                sessions[request.sessionId].id,
                request.data?.receiverUserId || null,
                request.data?.receiverChannelId || null,
                request.data?.fileName || null,
                request.data?.fileContent || null
            );
            response.data = 'OK';
            return response;
        case commands.DOWNLOAD_FILE:
            const [file] = await repository.downloadFile(
                request.data?.messageId
            )
            response.data = file;
            return response;
        case commands.EDIT_MESSAGE:
            await repository.editMessage(request.data?.id, request.data?.text);
            response.data = 'OK';
            return response;
        case commands.DELETE_MESSAGE:
            await repository.deleteMessage(request.data?.id);
            response.data = 'OK';
            return response;
        case commands.SEARCH_CHANNEL:
            response.data = await repository.findChannelByTag(request.data?.tag);
            return response;
    }

    try {
        await authorizeAdmin(request.sessionId);
    } catch {
        response.error = errors.NOT_AUTHORIZED;

        return response;
    }

    switch (request?.command) {
        case commands.ADD_USER:
            const password = generatePassword();

            await repository.addUser(
                request.data?.role,
                request.data?.status || 'active',
                request.data?.name,
                request.data?.email,
                password,
            );

            await sendPasswordToEmail(request.data?.email, password);

            response.data = 'OK';
            return response;
        case commands.ADD_CHANNEL:
            await repository.addChannel(
                request.data?.name,
                request.data?.tag,
            );
            response.data = 'OK';
            return response;
        case commands.DELETE_CHANNEL:
            await repository.deleteChannel(
                request.data?.id,
            );
            response.data = 'OK';
            return response;
        case commands.BLOCK_USER:
            await repository.blockUser(
                request.data?.id,
            );
            response.data = 'OK';
            return response;
        case commands.ACTIVATE_USER:
            await repository.activateUser(
                request.data?.id,
            );
            response.data = 'OK';
            return response;
        case commands.DELETE_USER:
            await repository.deleteUser(
                request.data?.id,
            );
            response.data = 'OK';
            return response;
        default:
            response.data = 'Unknown command';
            return response;
    }

    return response;
}

module.exports = {
    process,
}
