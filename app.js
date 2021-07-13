const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const Https = require('https');
const { readdir } = require('fs');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function (req, res) {
   res.sendFile(__dirname + "/signup.html");
});

app.post('/', function (req, res) {
   var name = req.body.name;
   var email = req.body.email;
   var phone = req.body.phone;
   var district = req.body.district;
   var message = req.body.message;
   var open = Boolean(req.body.open);

   // changing the checkbox value in string
   if (open === true) {
      open = 'Yes';

   } else {
      open = 'No';
   }

   var data = {
      members: [
         {
            email_address: email,
            status: 'subscribed',
            merge_fields: {
               NAME1: name,
               DISTRICT1: district,
               PHONE1: phone,
               MESSAGE1: message,
               OPEN1: open
            }
         }
      ]
   };

   const jsonData = JSON.stringify(data);

   const url = 'https://us20.api.mailchimp.com/3.0/lists/4a055154e2';
   const options = {
      method: 'POST',
      auth: "sreenath:ab66ce9027e7b25bc8e63aaa8197b7f8-us20"
   };

   const request = Https.request(url, options, function (response) {
      response.on('data', function (data) {
         var data1 = JSON.parse(data);
         errCode = data1.error_count;
         if (errCode == 0) {
            res.sendFile(__dirname + '/success.html');

         } else {
            res.sendFile(__dirname + '/failure.html');
         };
      });

   });
   request.write(jsonData);
   request.end();
   // ab66ce9027e7b25bc8e63aaa8197b7f8-us20
});

app.post('/success', function (req, res) {
   res.redirect('/');
})
app.post('/failure', function (req, res) {
   res.redirect('/');
})

app.listen(process.env.PORT || 3000, function () {
   console.log('Server is listing on port 3000');
});
