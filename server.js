const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION Shuting down...');
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./index');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const port = process.env.PORT || 5000;

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful');
    app.listen(port, () => {
      console.log(`Now listening on port ${port}`);
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
