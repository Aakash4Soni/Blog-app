var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer");
var mongoose = require("mongoose");
var express = require("express");
const { render } = require("ejs");
express = require("express");
app = express();


//APP CONFIG
mongoose.connect("mongodb+srv://Aakashsoni:Aakashsoni1234@cluster0.ro4xfc3.mongodb.net/blogapp", { useNewUrlParser: true })
.then(() => console.log("DB working!"))
.catch((error) => console.log(error));;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//MONGOOSE/MODEL CONFIG
//Schema: roadmap blueprint
var blogSchema = new mongoose.Schema({
     title: String,
     image: String,
     body: String,
     created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs")
});


// INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR");
        } else{
            res.render("index", {blogs: blogs});
        }
    });
});

//NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
}); 

//CREATE ROUTE
app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, (err, newBlog) => {
        // create blog
        if(err){
            res.render("new");
        } else {
            // then, redirect to the index
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }
         else {
            res.render("edit", {blog: foundBlog});
        } 
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            //redirect somewhere
            res.redirect("/blogs");
        }
    });
});
app.get('*', function(req, res){
    res.send("OOPS!!! FOUND NOTHING")
});
 
app.listen(process.env.PORT || 3000, function(){
    console.log("Server started for BLOGAPP at port 3000")
});
