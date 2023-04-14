// ***** *** Require Packages: *** *****
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// *** Create a New Database inside MongoDB via Connecting mongoose: ***
mongoose.connect("mongodb+srv://anshulkashyaph:OgcFUfdGu23Owxt4@cluster0.t4nwmp2.mongodb.net/todolistDB");
// mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {useNewUrlParser: true}); // ==> use this if deprect a warning 

// *** Create a Schema: ***
const itemsSchema = {
    name: String
};

// *** Create a Model: (usually Capitalized) ***
const Item = mongoose.model("Item", itemsSchema);

// *** Create a Mongoose Documents: ***
const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

// *** Create a list Schema: ***
const listSchema = {
    name: String,
    items: [itemsSchema]
};

// *** Create a list Model: ***
const List = mongoose.model("list", listSchema);

app.get("/", function (req, res) {
    // *** Mongoose find() ***
    Item.find().then(function (foundItems) {

        if (foundItems.length === 0) {
            // *** Mongoose insertMany() ***
            Item.insertMany(defaultItems).then(function () {

                console.log("Successfully saved default items to databse.");

            }).catch(function (err) {
                console.log(err);
            })
            res.redirect("/");
        }
        else {
            res.render("list", { listTitle: "Today", newListItems: foundItems });
        }
    })
        .catch(function (err) {
            console.log(err);
        })
});

//Ignore the "favicon" from being added to the database.
//Define this outside any GET or POST handling methods (and preferrably before/just above the path) where,
// you defined the custom parameter route
app.use(function (req, res, next) {

    if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
        return res.sendStatus(204);
    }

    return next();

});

// *** Create a custom parameters Route: ***
app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName }).then(function (foundList) {


        if (!foundList) {
            // *** Create a new list: ***
            // *** Create a new Mongoose Document: ***

            // ***Using ".create" method instead of ".save()" method *****

            List.create(
                {
                    name: customListName,
                    items: defaultItems

                }).then(function () {
                    console.log("Successfully added to the list!")
                })
            res.redirect("/" + customListName);
        }
        else {
            // *** Show an existing list: ***
            res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
        }


    }).catch(function (err) {
        console.log(err);
    })


});



app.post("/", function (req, res) {
    // *** Adding a New Item: ***
    const itemName = req.body.newItem;
    const listName = req.body.list.trim();

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        // *** Save item to mongoose: ***
        item.save().then(function () {
            console.log("Succesfully added item!")
        });
        // *** render item to home page: ***
        res.redirect("/");
    }
    else {
        List.findOne({ name: listName }).then(function (foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
            .catch(function (err) {
                console.log(err);
            })
    }
});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox.trim();
    const listName = req.body.listName.trim();

    if (listName === "Today") {
        Item.findByIdAndDelete(checkedItemId).then(function () {

            // mongoose.connection.close();
            console.log("Successfully deleted checked item.");
            res.redirect("/");

        })
            .catch(function (err) {
                console.log(err);
            })
    }
    else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }).then(function (foundList) {

            res.redirect("/" + listName);
        })
            .catch(function (err) {
                console.log(err);
            })
    }
});


app.get("/about", function (req, res) {
    res.render("about");
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});