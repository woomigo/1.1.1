// server.js
const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth');
const blockRoutes = require('./routes/blocked')
const usersRoutes = require('./routes/users')
const followersRoutes = require('./routes/followers')
const wooRoutes = require('./routes/woos')
const migoRoutes = require('./routes/migos')
const storiesRoutes = require('./routes/stories')
const followRequestRoutes = require('./routes/followRequests')
const galleriesRoutes = require('./routes/galleries')
const groupRoutes = require('./routes/groups')
const groupManagerRoutes = require('./routes/groupManagers')
const groupMemberRoutes = require('./routes/groupMemberRoutes')
const subScriptionRoutes = require('./routes/subscriptions')
const likeRoutes = require('./routes/likes')
const commentsRoutes = require('./routes/comments');
const listRoutes = require('./routes/lists');
const tagRoutes = require('./routes/tags')
const relationShipRoutes = require('./routes/relationships')

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/block', blockRoutes); 
app.use('/users', usersRoutes);
app.use('/followers', followersRoutes);
app.use('/woos', wooRoutes);
app.use('/migos', migoRoutes)
app.use('/stories', storiesRoutes)
app.use('/follow-requests', followRequestRoutes)
app.use('/galleries', galleriesRoutes);
app.use('/lists', listRoutes);
app.use('/groups', groupRoutes);
app.use('/group-managers', groupManagerRoutes);
app.use('/group-members', groupMemberRoutes);
app.use('/subscriptions', subScriptionRoutes)
app.use('/woo-likes', likeRoutes)
app.use('/comments', commentsRoutes);
app.use('/tags', tagRoutes);
app.use('/relationships', relationShipRoutes)

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
