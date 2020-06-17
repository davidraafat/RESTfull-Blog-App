const expressSanitizer = require("express-sanitizer");

var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    methodOverride = require("method-override"),
    epressSanitizer= require("express-sanitizer");

//Start our app config
mongoose.connect("mongodb://localhost:27017/Blogs", {useNewUrlParser:true, useUnifiedTopology:true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//Model Blog
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type:Date, default:Date.now() }
});
var Blog = mongoose.model("Blog",blogSchema);

//RESTfull routes
/** Index route */
app.get("/",(req,res)=>{
    res.redirect("/blogs");
});
app.get("/blogs",(req,res)=>{
    Blog.find({},(err,blogs)=>{
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:blogs});
        }
    });
});
/** New route */
app.get("/blogs/new",(req,res)=>{
    res.render("new");
});
/** Create blog route */
app.post("/blogs",(req,res)=>{
    req.body.body = req.sanitize(req.body.body);
    Blog.create({
        title:req.body.title,
        image:req.body.image,
        body:req.body.body
    },(err,newBlog)=>{
        if(err){
            console.log(err);
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});
/** Show blog route */
app.get("/blogs/:id",(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:foundBlog});
        }
    });
});
/** Edit route */
app.get("/blogs/:id/edit",(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else {
            res.render("edit",{blog:foundBlog});
        }
    });
});
/** Update blog route */
app.put("/blogs/:id",(req,res)=>{
    req.body.body = req.sanitize(req.body.body);
    Blog.findByIdAndUpdate(req.params.id,{title:req.body.title,image:req.body.image,body:req.body.body},(err,updatedBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{  
            res.redirect("/blogs/"+req.params.id);
        }
    });
});
/** Delete blog route */
app.delete("/blogs/:id",(req,res)=>{
    Blog.findByIdAndDelete(req.params.id,(err)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});


app.listen(3000,(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Blog server listen on 3000");
    }
});