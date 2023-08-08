const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require('mongoose');
const async = require("async");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.set('view engine', 'ejs');

const db = "mongodb+srv://yogeshsewada0:yogesh@todolist.qdqtfhq.mongodb.net/?retryWrites=true&w=majority";



// mongo db data base setup 
mongoose.connect(db, {useNewUrlParser: true});

const itemSchema = {
    name : String
}

const Item = mongoose.model("Item", itemSchema);

const item2 = new Item({
    name : "Click + to add item"
});
const item1 = new Item({
    name : "Enter the to do item"
});

const defaultList = [item1, item2];

const listSchema = {
    name : String,
    items : [itemSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function (req, res) {

    // var today = new Date();
    // var options ={
    //     weekday : 'long',
    //     day : 'numeric',
    //     month : 'long',
    //     year : 'numeric'
    // };

    // var day = today.toLocaleDateString("hi-IN", options);
    var day = "Home";


    async function findItems() {
        const foundItems = await Item.find();
        res.render('list', {listTitle: day, newListItems: foundItems});
        return foundItems;
    }

    findItems();
    
})



app.get("/about", function (req, res) {
    res.render("about");
})

app.get("/:paramName", function (req,res) {
    const head = req.params.paramName;

    async function findList(){
        const exists = await List.findOne({name : head});
        if(exists){
            // console.log("list already exits");
            // console.log()
            res.render('list', {listTitle: exists.name, newListItems: exists.items});
        }else{
            const list = new List({
                name : head,
                items : defaultList
            });
            list.save();
            res.redirect("/"+ head);
        }
    }

    findList();


    async function findItems() {
        const foundItems = await Item.find();
        res.render('list', {listTitle: head, newListItems: foundItems});
        return foundItems;
    }

    // findItems();

    })



app.post("/", function (req, res) {

    itemName = req.body.newItem;
    listName = req.body.list;
    const item = new Item({
        name : itemName
    });

    if(listName === "Home"){
        item.save();
        res.redirect("/");
    }else{
        async function findListName(){
            const exists = await List.findOne({name : listName});
            exists.items.push(item);
            exists.save();
            res.redirect("/" + listName);
        }
        findListName();
    }

})

app.post("/delete", function (req, res) {
    const id = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Home") {
        async function dlt() {
            await Item.findOneAndDelete({_id : id});
        }
    
        dlt();
        res.redirect("/");
    } else {
        async function update() {
            const deletedItem = List.findOneAndUpdate({name : listName}, {$pull : {field : {_id : id}}});
           
        }
        update();
        res.redirect("/" + listName);
    }
    
})





app.listen(30000, function () {
    console.log("server is listening");
})