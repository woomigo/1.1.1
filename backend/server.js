// server.js
const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users')
const wooRoutes = require('./routes/woos')
const migoRoutes = require('./routes/migos')
const storiesRoutes = require('./routes/stories')

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes); 
app.use('/users', usersRoutes);
app.use('/woos', wooRoutes);
app.use('/migos', migoRoutes)
app.use('/stories', storiesRoutes)

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
