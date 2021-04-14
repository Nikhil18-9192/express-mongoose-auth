const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const { ApolloServer, gql } = require('apollo-server-express');
require('dotenv/config');
require('./config/passport')(passport);
const { typeDefs } = require('./typeDefs');
const { resolvers } = require('./resolvers');

app.use(express.json());
app.use(cors());
//connect to db
mongoose.connect(
  // process.env.DB_CONNECTION,
  'monodb://mongo:27017/docker-node-mongo',
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  () => {
    console.log('connected to DB!');
  }
);

//apollo gql setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
server.applyMiddleware({ app });

//passport session
app.use(
  session({
    secret: 'nikhil',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//import routes
const postRoute = require('./router/post');
const loginRoute = require('./router/user');

app.use('/posts', postRoute);
app.use('/', loginRoute);

//home route
app.get('/', (req, res) => {
  res.send('we are on home route');
});

app.listen(3000, () => {
  console.log('server running on 3000');
});
