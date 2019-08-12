class SocketUtil{
    constructor()
    {
        this.socket = io('http://localhost:3000');
    }

    getSocket()
    {
        return this.socket;
    }

    send(type, to, payload)
    {
        console.log('sending ' + type + ' to ' + to);

        this.socket.emit('message', {
            to: to,
            type: type,
            payload: payload
        });
    }
}
