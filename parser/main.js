const
  express     = require('express'),
  body_parser = require('body-parser'),
  mongoose    = require('mongoose'),
  request = require('request')


const prompt = require('prompt-sync')();

const app = express()

let usernameQ = prompt('Username:')
let passwordQ = prompt.hide('Password:')

if (usernameQ && passwordQ) {
  (async function() {
    const res = await requestLogin(usernameQ, passwordQ)
    if (res.statusCode === 400) {
      console.log('\x1b[41m', 'Login details are incorrect')
      process.exit(1)
    }

    if (res.statusCode === 200) {
      await createPosition(res.body.auth_token)
    }

  })()
}

mongoose.connect(`mongodb://dbname:dbpass@localhost/replase`, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
  .catch(err => console.log(err));

  const Position =  mongoose.model('positions', new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    article: {
      type: String,
      default: 'Отсутствует',
    },
    quantity: {
      type: Number,
      default: 1,
    },
    cost: {
      type: Number,
      default: 1,
    },
    orderCost: {
      type: Number,
      default: 1,
    },
    type: {
        type: String,
        required: true
    },
}))

app.use(require('morgan')('dev'));
app.use(body_parser.urlencoded({extended: true}));
app.use(body_parser.json());
app.use(require('cors')());


const createPosition = async function (token) {
  const positions = await Position.find({quantity: {$gte: 1}})

  await positions.map(async (item, index) => {
      
    await setTimeout(async () => {
      const res = await requestCreatePosition({
        name: item.name,
        article: item.article,
        quantity: item.quantity,
        cost: item.cost,
        cost_of_sale: item.orderCost,
        alias_id: item._id
      }, token)
      console.log('\x1b[0m', res)
      if (positions.length === index + 1) {
        console.log('')
        console.log('\x1b[32m', 'All items successfully added. Amount position: ' + positions.length)
        process.exit(1)
      }
    }, 250 * index)

    
  })

  
}

function requestCreatePosition(position = {}, token) {
  return new Promise(function (resolve, reject) {
    request.post({
      url: 'http://localhost:8000/api/v1/position/create',
      json: position,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    }, (err, res, body) => {
      if (!err) {
        resolve(body)
      } else {
        reject(err)
      }
    })
  })
}

function requestLogin(username, password) {
  return new Promise(function (resolve, reject) {
    request.post({
      url: 'http://localhost:8000/api/v1/auth/token/login',
      json: {username, password},
      headers: {
        'Content-Type': 'application/json',
      }
    }, (err, res, body) => {
      if (!err) {
        resolve(res)
      } else {
        reject(err)
      }
    })
  })
}

app.listen(3000);