const express = require('express')
const app = express()
const PORT = 3000
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb+srv://roeen:mongodb@star-wars-cluster.cpgknpx.mongodb.net/?retryWrites=true&w=majority'

// EJS --- Must be placed before app.use, app.get, or app.post
app.set('view engine', 'ejs')


// BodyParser --- Make sure to put body-parser before the CRUD handlers
app.use(bodyParser.urlencoded({extended : true}))


// MongoDB Setup
MongoClient.connect(connectionString)
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')

        app.get('/', (req, res) => {
            // res.sendFile(__dirname + '/index.html')
            const cursor = db.collection('quotes').find().toArray()
            cursor.then(results => {
                console.log(results);
            })
            .catch(error => console.error(error))
        })
        app.post('/quotes', (req, res) => { 
            quotesCollection.insertOne(req.body)
            .then(result => {
                res.redirect('/')
            })
            .catch(error => console.error(error))
        })
        app.listen(process.env.PORT || PORT, console.log(`THE SERVER IS RUNNING ON PORT ${PORT}`))
    })
    .catch(error => console.error(error))

    






