const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const mongodb = require("mongodb").MongoClient;
require("dotenv").config();

const MongoClient = require("mongodb").MongoClient;

const app = express();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mxxb3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const appointmentCollection = client
    .db("doctorsPortal")
    .collection("appointments");

  app.post("/addAppointment", (req, res) => {
    const appointment = req.body;
    appointmentCollection.insertOne(appointment).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/appointments", (req, res) => {
    appointmentCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.post("/appointmentByDate", (req, res) => {
    const date = req.body;
    console.log(date.date);
    appointmentCollection
      .find({ date: date.date })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
  app.post("/addADoctor", (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;
    const newImg = file.data;
    console.log(file, email, name, newImg);
    // const encImg = newImg.toString("base64");

    // var image = {
    //   contentType: file.mimetype,
    //   size: file.size,
    //   img: Buffer.from(encImg, "base64"),
    // };

    // doctorCollection.insertOne({ name, email, image }).then((result) => {
    //   res.send(result.insertedCount > 0);
    // });
  });

  app.get("/doctors", (req, res) => {
    doctorCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/isDoctor", (req, res) => {
    const email = req.body.email;
    doctorCollection.find({ email: email }).toArray((err, doctors) => {
      res.send(doctors.length > 0);
    });
  });
});

app.use(express.json());
app.use(cors());
app.use(express.static("doctors"));
app.use(fileUpload());

const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello from Db");
});
app.listen(port);
