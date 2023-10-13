const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const corsOptions = require('./config/corsOptions');
const { Server } = require('socket.io');

// const httpServer = require('http').createServer();
// const io = require('socket.io')(httpServer);

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION Shuting down...');
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./index');
const { addToCart } = require('./controllers/cartController');

const server = http.createServer(app);
// const io = socketIO(server);

const io = new Server(server, {
  cors: corsOptions,
});

io.on('connection', (socket) => {
  console.log(`A user connected : ${socket.id}`);

  socket.on('removeCartProduct', (data) => {
    console.log('data', data);
    socket.broadcast.emit('received_message', data);
  });

  socket.on('cartUpdated', async (data) => {
    console.log('here...');
    socket.broadcast.emit('received_message', data);
  });

  socket.on('decreaseQuantity', async (data) => {
    socket.broadcast.emit('received_message', data);
  });

  socket.on('removeWishlistProduct', async (data) => {
    socket.broadcast.emit('received_wishlist_data', data);
  });
  socket.on('removeAllWishlistProducts', async (data) => {
    socket.broadcast.emit('received_wishlist_data', data);
  });
  socket.on('createWishlistProduct', async (data) => {
    socket.broadcast.emit('received_wishlist_data', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// io.on('connection', (socket) => {
//   console.log('A new client connected');

//   // Listen for the "update_cart" event from the client
//   socket.on('update_cart', (updatedCart) => {
//     console.log('Received update_cart event from client:', updatedCart);

//     // Here, you can update the cart data in your database or perform any other necessary actions

//     // Emit a "cartUpdated" event to all connected clients with the updated cart data
//     io.emit('cartUpdated', updatedCart);
//   });

//   // Disconnect event
//   socket.on('disconnect', () => {
//     console.log('A client disconnected');
//   });
// });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const port = process.env.PORT || 5000;

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful');
    // app.listen(port, () => {
    //   console.log(`Now listening on port ${port}`);
    // });
    server.listen(port, () => {
      console.log('Server started on port 5000');
    });
  })
  .catch((err) => {
    console.log('DB connection failed', err);
  });

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION Shuting down...');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
