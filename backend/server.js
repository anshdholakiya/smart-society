require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const userRoutes = require('./routes/userRoutes');
const billRoutes = require('./routes/billRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const statsRoutes = require('./routes/statsRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const societyRoutes = require('./routes/societyRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Society Management API is running...' });
});

app.use('/api/users', userRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/society', societyRoutes);
app.use('/api/bookings', bookingRoutes);

if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: process.env.NODE_ENV === 'development' ? err.message : {} });
});

process.on('exit', (code) => {
  console.log('Process is exiting with code', code);
  console.trace('Exit trace');
});

db.sequelize.sync({ alter: true })
  .then(() => {
    console.log(' Database synced successfully.');
    app.listen(PORT, () => {
      console.log(` Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' Unable to connect/sync to the database:', err);
    process.exit(1);
  });