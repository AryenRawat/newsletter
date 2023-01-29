const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const request = require('request');
const md5 = require("md5");

const listId = "0656164035";
const mailchimp = require("@mailchimp/mailchimp_marketing");

require('dotenv').config();


app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}))

const port=3000;

mailchimp.setConfig({
    apiKey: process.env.apiKey,
    server: process.env.server,
  });



app.get('/', (req, res) =>{
    res.sendFile(__dirname+'/signup.html');
})

app.post('/', (req, res) =>{
    var firstname = req.body.fname;
    var lastname = req.body.lname;
    var email = req.body.e_mail;
    var data={
        email: email,
        firstName: firstname,
        lastName: lastname
    }
    const subscriberHash = md5(data.email.toLowerCase());
    async function run() {
        try{const response = await mailchimp.lists.addListMember(listId, {
          email_address: data.email,
          status: "subscribed",
          merge_fields: {
            FNAME: data.firstName,
            LNAME: data.lastName
          }
        });
        console.log(
          `Successfully added contact as an audience member. The contact's id is ${
            response.id
          }.`
        );
        res.sendFile(__dirname+'/success.html')
      }catch(e) {
        res.sendFile(__dirname+'/error.html')
      }
    }
      run();
})

app.post('/error', function(req, res){
  res.redirect('/')
})


app.listen(process.env.PORT || port, function(){
    console.log('listening on port 3000')
});

//a22079d65dd4c897f95d818c20030e38-us21
//0656164035