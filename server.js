const express = require('express')
const app = express()
const PORT = 3000
const bodyParser = require('body-parser')
const { query } = require('express')
const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb+srv://roeen:mongodb@star-wars-cluster.cpgknpx.mongodb.net/?retryWrites=true&w=majority'
const cors = require('cors')


// MongoDB Setup
MongoClient.connect(connectionString)
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('star-wars-quotes') //Renamed the db to star-wars-quotes

        const quotesCollection = db.collection('quotes') //This is the variable for our quotes collection. For reusability

        // EJS --- Must be placed before app.use, app.get, or app.post
        app.set('view engine', 'ejs')

        // Enables us to use font-awesome
        app.use(cors())

        // BodyParser --- Make sure to put body-parser before the CRUD handlers
        app.use(bodyParser.urlencoded({extended : true}))

        // Express.static middleware -- this will take care of our public folder files e.g. css, client side JS, images, and fonts
        app.use(express.static('public'))

        // Enables our server to accept JSON data
        app.use(express.json())
        
        app.get('/', (req, res) => {
            quotesCollection.find().toArray()
                .then(results => {
                    res.render('index.ejs',{quotes: results})
                })
                .catch(error => console.error(error))
        })

        // The route must match with the action route on the form in the EJS
        app.post('/quotes', (req, res) => { 
            quotesCollection.insertOne(req.body)
            .then(result => {
                res.redirect('/') //This refreshes the page and goes back to the root and triggers a .get() request
            })
            .catch(error => console.error(error))
        })

        app.put('/quotes', (req, res) => {
            console.log(req.body);

            quotesCollection.findOneAndUpdate(
                {author: 'Yoda'},
                {
                    $set: {
                    author: req.body.author,
                    quote: req.body.quote
                    }
                },
                {upsert: true}
            )
            .then(result => {
                res.json('Success')
            })
            .catch(error => console.error(error))           
        })

        // Delete Darth Vader's quote
        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
                {author: req.body.author}, 
            )
            .then(result => {
                if(result.deletedCount === 0){
                    return res.json('No quote to delete')
                }
                res.json(`Deleted Darth Vader's quote`)
            })
            .catch(error => console.error(error))
        })
        

        // Delete a Quote
        app.delete('/deleteQuote', (req, res) => {
            quotesCollection.deleteOne(
                {author: req.body.author},
            )
            .then(result => {
                console.log('Quote Deleted');
                res.json(`Quote was deleted`)
            })
            .catch(error => console.error(error))
        })

        
        app.listen(process.env.PORT || PORT, console.log(`THE SERVER IS RUNNING ON PORT ${PORT}`))
    })
    .catch(error => console.error(error))








