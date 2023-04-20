//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
require('dotenv').config();


const homeStartingContent = "Welcome to our blog! Here you'll find a variety of articles on topics such as technology, travel, lifestyle, and more. Our goal is to provide informative and engaging content that you'll enjoy reading. Take a look around and feel free to leave comments and share our articles with your friends. Thank you for visiting and we hope you'll come back soon!";

const aboutContent = "Welcome to our blog! We are a team of passionate writers who share a common interest in creating and sharing valuable content with our readers. Our goal is to provide informative and engaging articles on various topics, ranging from lifestyle and health to technology and business. We believe in the power of knowledge and strive to deliver high-quality content that is both informative and entertaining. We are dedicated to building a community of like-minded individuals who share our passion for learning and personal growth. Thank you for joining us on this journey, and we hope you enjoy reading our content as much as we enjoy creating it!";



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});
const CONNECTION_URL = `mongodb+srv://sinhayash:${process.env.SECRET_KEY}@cluster0.14ggcya.mongodb.net/blogs?retryWrites=true&w=majority`;mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));


const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact");
});


app.listen(3000, function() {
  console.log(`server started at http://localhost:${3000}`);
});
