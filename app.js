const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

const PORT = 4000;

const app = express();
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(methodOverride('_method'));

app.get('/', function(req,res,next){
    res.render('searchusers');
});

app.listen(PORT, function(){
    console.log('Server started on port '+PORT);
});