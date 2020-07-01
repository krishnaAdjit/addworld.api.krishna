const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const port = process.env.PORT || 3500

//body-parse
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname))

//db connection
// const url = "mongodb://localhost:27017/addworld"
const url="mongodb+srv://krishna:krishna@addworld-ydorp.gcp.mongodb.net/addworld"
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
})
const connection = mongoose.connection

connection.once('open', () => {
    console.log('Database Connected')
}).catch((err) => {
    console.log("Database connection failed," + err)
})

//server listens
app.listen(port, () => {
    console.log(`server is lintening on ${port}`);
})

//routes
const App = require('./api/routes/routes')
app.use('/', App)

app.get('/', (req, res) => {
    res.send(` <html>
    <body><h1 style=" font-family: Arial, sans-serif; 
    text-align: center; font-size: 100px; font-style: initial;
    color: #AAA4A3;">WELCOME TO ADD WORLD</h1></body>
    </html>
    `)
})