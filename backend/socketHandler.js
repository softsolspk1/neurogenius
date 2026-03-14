
const socketIO = require('socket.io');

module.exports = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const rooms = new Map(); // Store room state

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('create_room', (data) => {
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      socket.join(roomId);
      
      const roomState = {
        id: roomId,
        creator: socket.id,
        creatorName: data.userName,
        players: [{ id: socket.id, name: data.userName, score: 0 }],
        status: 'waiting',
        categoryId: data.categoryId,
        questions: []
      };
      
      rooms.set(roomId, roomState);
      socket.emit('room_created', roomState);
      console.log(`Room created: ${roomId}`);
    });

    socket.on('join_room', (data) => {
      const room = rooms.get(data.roomId);
      if (room && room.status === 'waiting') {
        socket.join(data.roomId);
        room.players.push({ id: socket.id, name: data.userName, score: 0 });
        io.to(data.roomId).emit('room_updated', room);
      } else {
        socket.emit('error', { message: 'Room not found or game started' });
      }
    });

    socket.on('start_game', (data) => {
      const room = rooms.get(data.roomId);
      if (room && room.creator === socket.id) {
        room.status = 'playing';
        io.to(data.roomId).emit('game_started', room);
      }
    });

    socket.on('submit_answer', (data) => {
      const room = rooms.get(data.roomId);
      if (room) {
        const player = room.players.find(p => p.id === socket.id);
        if (player && data.isCorrect) {
          player.score += 10;
        }
        io.to(data.roomId).emit('room_updated', room);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Clean up empty rooms or notify players
      rooms.forEach((room, roomId) => {
        room.players = room.players.filter(p => p.id !== socket.id);
        if (room.players.length === 0) {
          rooms.delete(roomId);
        } else {
          io.to(roomId).emit('room_updated', room);
        }
      });
    });
  });

  return io;
};
