const mysql = require('mysql2');
const util = require('util');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1111",
    database: "messenger"
});

con.connect();

const query = util.promisify(con.query).bind(con);

function getUsers() {
    return query('SELECT id, role, status, name, email FROM user');
}

function getChannels() {
    return query('SELECT * FROM channel');
}

function getDirectMessages(meId, interlocutorId) {
    return query(`
        SELECT m.id, m.sender_id, m.receiver_user_id, m.receiver_channel_id, m.created_at, m.updated_at, m.text, m.file_name, s.name as sender_name FROM message m
        JOIN user s on s.id = m.sender_id
        WHERE sender_id = ? and receiver_user_id = ? or sender_id = ? and receiver_user_id = ? order by created_at
    `, [meId, interlocutorId, interlocutorId, meId]);
}

function getChannelMessages(channelId) {
    return query(`
        SELECT m.id, m.sender_id, m.receiver_user_id, m.receiver_channel_id, m.created_at, m.updated_at, m.text, m.file_name, s.name as sender_name FROM message m
        JOIN user s on s.id = m.sender_id
        WHERE receiver_channel_id = ? 
        order by created_at
    `, [channelId]);
}

function getUserById(meId) {
    return query('SELECT * FROM user WHERE id = ?', [meId]);
}

function sendMessage(text, senderId, receiverUserId, receiverChannelId, fileName, fileContent) {
    return query(`INSERT INTO message (text, sender_id, receiver_user_id, receiver_channel_id, created_at, file_name, file_content) VALUES (?, ?, ?, ?, now(), ?, ?)`, [text, senderId, receiverUserId, receiverChannelId, fileName, fileContent])
}

function downloadFile(messageId) {
    return query(`SELECT id, file_name, file_content FROM message WHERE id = ?`, [messageId]);
}

function editMessage(id, text) {
    return query('UPDATE message SET text = ?, updated_at = now() where id = ?', [text, id]);
}

function deleteMessage(id) {
    return query('delete from message where id = ?', [id]);
}

function addUser(role, status, name, email, password) {
    return query('INSERT into user (role, status, name, email, password) VALUES (?, ?, ?, ?, ?)', [role, status, name, email, password]);
}

function addChannel(name, tag) {
    return query('INSERT into channel (name, tag) VALUES (?, ?)', [name, tag]);
}

async function deleteChannel(id) {
    await query('DELETE FROM message where receiver_channel_id = ?', [id]);
    return query('DELETE FROM channel where id = ?', [id]);
}

function blockUser(id) {
    return query('update user set status = \'blocked\' where id = ?', [id]);
}

function activateUser(id) {
    return query('update user set status = \'active\' where id = ?', [id]);
}

async function deleteUser(id) {
    await query('DELETE FROM message where sender_id = ? or receiver_user_id = ?', [id, id]);
    return query('delete from user where id = ?', [id]);
}

async function getUserByEmailAndPassword(email, password) {
    const [user] = await query('SELECT id, role, status, name, email FROM user WHERE email = ? and password = ?', [email, password]);

    return user;
}

function findChannelByTag(tag) {
    return query('select * from channel where tag = ?', [tag]);
}

module.exports = {
    getUsers,
    getChannels,
    getDirectMessages,
    getChannelMessages,
    getUserById,
    sendMessage,
    downloadFile,
    editMessage,
    deleteMessage,
    addUser,
    addChannel,
    deleteChannel,
    blockUser,
    activateUser,
    deleteUser,
    getUserByEmailAndPassword,
    findChannelByTag,
};
