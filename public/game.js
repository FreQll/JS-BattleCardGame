
const socket = io();


socket.on('waiting_for_opponent', () => {
    document.getElementById('waiting_for_opponent').style.display = 'block';
});
socket.on('opponent_connected', (data) => {
    document.getElementById('waiting_for_opponent').style.display = 'none';
    document.getElementById('opponent_login').style.display = 'block';
    document.getElementById('opponent').textContent = data.login;
});
socket.on('opponent_disconnected', () => {
    console.log('opponent_disconnected');
    document.getElementById('opponent_disconnected').style.display = 'block';
});
socket.on('disconnect', () => {
    document.location.href = '/login';
});
socket.on('err_second_window', () => {
    console.log('err_second_window');
    document.getElementById('err_second_window').style.display = 'block';
});
