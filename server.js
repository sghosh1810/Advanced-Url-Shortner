//Importing all libs
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser')
const { compile } = require('morgan');

//Dev dependency
require('dotenv').config();


//Start Express
const app = express();

//Routes Handler
indexRouter = require('./route/index');
urlRouter = require('./route/url');

//Middlewares
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(helmet());
app.use(morgan('common'));
app.use(bodyParser.urlencoded({limit:'10mb', extended:true}))
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//Routes Handler
app.use('/',indexRouter);
app.use('/url',urlRouter);

//404 redirects
app.use((req, res, next) => {
    res.status(404).redirect('static/404.html');
});

//Ports for usage
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on ${process.env.HOST}:${port}`);
})
