var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = 3000;

// Initialize Express
var app = express();
// morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useMongoClient: true });

app.get("/", function(req, res) {
  // axios to get the body of the topstory news
  // load to cheerio 
  axios.get("https://www.bangkokpost.com/topstories").then(function(response) {
    var $ = cheerio.load(response.data);

    //headlines in H3, link a - child of H3
    $("h3").each(function(i, element) {
      var result = {};
      
      result.title = $(this)
        .children("a")
        .text();
    
      result.link = $(this)
        .children("a")
        .attr("href");

      // create new article in db from the result
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
    res.send("successful fetch");
  });
});

//get the fetched articles from MongoDB, using mongoose
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// create route when getting specific article by ID from the DB
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    //get the headline of that article and populate notes that associate with it
    //'note' key from ArticleSchema (Article.js)
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      //return the updated note
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
