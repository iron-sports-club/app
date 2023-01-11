const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = app => {
   
    // required for the app when deployed to Heroku (in production)
    app.set('trust proxy', 1);
   
    // use session
    app.use(
      session({
        secret: process.env.SESS_SECRET || 'my super secret',
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({ 
          mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/iron-sports-club',
          ttl: 24 * 60 * 60 // 1 day
      }),
        cookie: {
          // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          // secure: process.env.NODE_ENV === 'production',
          // httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000 // 1 day
        }
      })
    );
  };
