const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

//Create Redis client

let client = redis.createClient();

client.on('connect', ()=>{
    console.log('conneted to redis');
})

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

app.post('/user/search', (req,res,next)=>{
    let id = req.body.id;

    client.hgetall(id, (err,obj)=>{
        if(!obj) {
            res.render('searchusers', {
                error:'User does not exist'
            });
            }else{
                obj.id = id;
                res.render('details', {
                    user:obj
                });
            }
    });
});

app.get('/user/add', function(req,res,next){
    res.render('adduser');
});

app.post('/user/add', function(req,res,next){
    let id = req.body.id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let phone = req.body.phone;
    client.hmset(id,[
        'first_name', first_name,
        'last_name', last_name,
        'email', email,
        'phone', phone
    ],(err,reply)=>{
        if(err){
            console.log(err);
        }
        console.log(reply);
        res.redirect('/');
    });
});

app.delete('/user/delete/:id',(req,res,next)=>{
    client.del(req.params.id);
    res.redirect('/');
})

app.listen(PORT, function(){
    console.log('Server started on port '+PORT);
});