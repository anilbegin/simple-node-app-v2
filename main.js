// Adding additional features
// Also added Date Object to each note
const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
let app = express()
const path = require('path')
const mongodb = require('mongodb')
const ObjectId = require('mongodb').ObjectId

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))

// database connection
let db
//const connectionString = ''
mongodb.connect(process.env.CONNECTIONSTRING, {useUnifiedTopology: true}, function(err, client) {
  db = client.db()

  app.listen(3000)
})

// router level middleware
function getWeather() { return 0}

app.get('/', async function(req, res) {
  const itemx = await db.collection('itemx').find().toArray()
  //console.log(result)
  res.render('form', {itemx})
})

app.post('/answer', function(req, res) {
  if(req.body.color.trim().toUpperCase() == 'BLUE') {
    res.send(`
      <p>Congrats, your answer is correct</p>
      <a href='/'>back</a>
    `) 
  } else {
    res.send(`
      <p>Sorry, your answer is Incorrect</p>
      <a href='/'>try again</a>
    `) 
  }
})

// handled through backend
/*
app.post('/create-item', async function(req, res) {
  //console.log(req.body.item)
  const result = await db.collection('itemx').insertOne({text: req.body.item, date: new Date()})
  //console.log(result)
  if(result) {
    //console.log(result)
    res.redirect('/')
  }
})
*/

// Client side rendering (browser.js)
app.post('/add-item', async function(req, res) {
const result = await db.collection('itemx').insertOne({text: req.body.text, date: new Date()})
//  console.log(result.ops[0])
  res.json(result.ops[0])
  //res.send('success')
})

app.post('/edit-item', async function(req, res) {
  //console.log(req.body.text)
  if(req.body.text == "" || req.body.text == null) {
    console.log('blank item not allowed!!')
  } else {
    const result = await db.collection('itemx').findOneAndUpdate({_id: new ObjectId(req.body.id)}, {$set: {text: req.body.text, date: new Date()}}, {returnOriginal:false})
    //console.log(result.value)
    res.json(result.value) // for extracting date value for Updated Date.
    //res.json({_id: info.insertedId, text: req.body.text})
    //res.send('success') // this res.send() causes -- *Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client*
  }
  
})

app.post('/delete-item', async function(req, res) {
  await db.collection('itemx').deleteOne({_id: new ObjectId(req.body.id)})
  res.send('success')
})