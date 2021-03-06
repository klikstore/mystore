var express= require('express'),
bodyParser = require('body-parser'),
session = require('express-session'),
Bourne = require('bourne'),
 db = new Bourne('users.json'), 
crypto = require('crypto'),

router = express.Router()

 

 function hash (password){
     return crypto.createHash('sha256').update(password).digest('hex');
 }

 router
       .use(bodyParser.urlencoded())
       .use(bodyParser.json())   
       .use(session({secret: 'adjskdjdlklfkdkfdfldkdljjjfkjsd'}))
       .get('/login', function(req, res){
            res.sendfile('public/login.html');
       })
       .post('/login', function(req, res){
       var user= {
            username:req.body.username,
            passowrd:hash(req.body.password)  
          };   
       
           db.findOne(user, function(err , data){
               if (data){
                     req.session.userId =data.id;
                   res.redirect('/list');
               
                }
                else{
                    res.redirect('/login');
                }
               
           });
       })
       .post('/register', function(req, res){
           var user={
            username:req.body.username,
            passowrd:hash(req.body.password), 
            options:{} 
          };
          db.find({username:user.username}, function(err, data){
              if (!data.length){
                  db.insert(user, function(err, data){
                     req.session.userId =data.id;
                   res.redirect('/list');  
                  });
              } else{
                  res.redirect('/login');
              }
          });     
       })  
       .get('/logout', function(req, res){
           req.session.userId=null;
           res.redirect('/klikstore');
       })
       .use(function(req, res, next){
           if (req.session.userId){
               db.findOne({ id:req.session.userId}, function(err, data){
                   req.user = data;
               });
           }
           next();
       });
module.exports=router;
   