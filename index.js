const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const ejs = require("ejs");
const fileUpload = require("express-fileupload");
const Api = require('./data');
const url = require("url");
const nodemailer = require('nodemailer');


app.use(bodyParser.json());
app.use(express.static("views"));

app.use(express.static(__dirname + "/Assets"));
app.use(express.static(__dirname + "/Assets"));
app.use(fileUpload());
app.set ("view engine" ,  "ejs");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.get("/", (req,res) => {
    res.render("index" , {Api:Api});
});

app.get("/Api", (req,res) => {
    res.json(Api);
});


 app.get('/contact', (req, res) => {
     res.sendFile(__dirname + "/" + "contact.html");
 });


app.post('/contact', function(req,res) {
   
    const adr = req.url;
    const q = url.parse(adr, true);
    const qdata = q.query;
     console.log(qdata);
    
    const msg =
      "<p>First name:" +
      req.body.firstName + '\r\n </p>' +
      "<p>last name:" +
      req.body.lastName + '\r\n </p>'
      +"<p>Email:" +
      req.body.Email + '\r\n </p>'
      + "<p>Message:" +
      req.body.Message; '\r\n </p>'
      console.log(msg);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "yasir269050@gmail.com",
          pass: "********"
        }
      });
   
      var mailOptions = {
        from: "yasir269050@gmail.com",
        to: "yasir269050@yahoo.com",
        subject: "Sending Email using Express with user information submitted via form",
        html: msg
      };
   
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
        //  res.write(error);
          res.end();
        } else {
          res.write("Email sent. Thanks for your information. We will be back soon! :) " + info.response);
          res.end();
        }
      });

    //   res.sendFile(__dirname + "/" + "contact.html");
    });



app.get('/students/add-student', (req, res) => {
    res.sendFile(__dirname + "/" + "add-student.html");
});


    app.post ("/students/add-student", (req,res) => {

        console.log(req.files.sampleFile.firstName)

       

        if   (!req.files)
            return res.status(400).send("No files were uploaded.");

             let sampleFile = req.files.sampleFile;

    sampleFile.mv(__dirname + "/assets/images/" + req.body.firstName + ".jpg" , function(err) {
        if (err)
        return res.status(500).send(err);

        req.body.src =  req.body.firstName + ".jpg"
        req.body.alt =  req.body.firstName
        Api.data.push(req.body)
        console.log(Api.data)
        res.send("File Uploaded and thanks for your information, We will be in contact!!");

    });
});


// app.get ("/details/:index" , (req, res) =>{
//     res.render("details", {student: Api.data[req.params.index]})
// });



app.listen(port, () => {
    console.log("Photo Gallery Server App is running");
    console.log(`Server is live $(port}...`);
})
