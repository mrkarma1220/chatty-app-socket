const io = require('socket.io')(8080,{
    cors: {
        origin: "http://localhost:3000"
    },
});

var users = [];

const addUser = (userEmail, socketId) => {
    !users.some(user => user.userEmail == userEmail) && 
        users.push({userEmail, socketId})
    console.log(users)
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId != socketId);
}

const getUser = (userId) => {
    return users.find(user => user.userEmail == userId);
}
io.on('connection', (socket) => {
    socket.on('addUser', userEmail => {
        addUser(userEmail, socket.id);
        io.emit('getUsers', users)
    });
    socket.on("disconnect", () => {
        removeUser(socket.id)
        io.emit('getUsers', users)
    })

    socket.on('sendMessage',({ senderId, receiverId, text}) => {
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
        })
    })
})