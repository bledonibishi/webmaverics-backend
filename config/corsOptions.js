const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://webmaverics.com',
  ],
  optionsSuccessStatus: 200,
  credentials: true,
};

module.exports = corsOptions;
