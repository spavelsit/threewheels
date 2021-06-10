const
  express     = require('express'),
  body_parser = require('body-parser'),
  mongoose    = require('mongoose'),
  passport    = require('passport');

const config = require('./common/config');

const
  authentication_router = require('./routes/authentication'),
  position_router       = require('./routes/position'),
  client_router       = require('./routes/client'),
  order_router          = require('./routes/order');

const app = express();

mongoose.connect(`mongodb://${config.db.username}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.db_name}`, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(passport.initialize());
require('./common/middleware/passport')(passport);

app.use(require('morgan')('dev'));
app.use(body_parser.urlencoded({extended: true}));
app.use(body_parser.json());
app.use(require('cors')());


app.use('/api/authentication', authentication_router);
app.use('/api/positions', position_router);
app.use('/api/client', client_router);
app.use('/api/order', order_router);

// app.use(express.static('../client'));
//
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '..' ,'client', 'index.html'));
// })

app.listen(config.port, () => console.log(`Server has been started on port ${config.port}`));
