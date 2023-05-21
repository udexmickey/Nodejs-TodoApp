
const express    = require("express"),
      bodyParser = require("body-parser"),
      ejs        = require("ejs"),
      mongoose   = require("mongoose"),
      datetime   = require(__dirname + "/date.js"),
      _          = require("lodash");
      app        = express();
      port = 4000;

//     console.log(datetime.timeDay())
//     console.log(datetime.timeDat())
// // console.log(datetime.timeDate())
mongoose.connect("mongodb://localhost:27017/todoDb", {useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false})
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))



const todoSchema = new mongoose.Schema({
    input: String
        
})

const Todo = mongoose.model("Todo", todoSchema);

const day = datetime.timeDat();

  
const listSChema = new mongoose.Schema({
    name: String,
    items: [todoSchema]
})

const List = mongoose.model("List", listSChema)


app.get("/", (req, res)=>{

    Todo.find({}, (err, lists)=>{
        if(!err){ 
            res.render("list", {listTitle: day, todo : lists})
        } else{
            console.log(err)
        }   
    })
})
 
app.post("/", (req, res)=>{
    todoName = req.body.title;
    buttonList = req.body.buttonList;

    const item = new Todo({
        input : todoName
    })
    if(buttonList === day){   
    item.save();
    res.redirect("/");           
    } else {
        //FOR EVERY TIME A NEW TODO IS ADDED IT PUSHES TO THE Todo OF todoDbl
        List.findOne({name: buttonList}, (err, todos)=>{
            if(!err){
                todos.save()
                todos.items.push(item)    
                res.redirect("/" + buttonList); 
            }
        })
    }    
})
app.get("/:paraId", (req, res)=>{
    const paraId = _.capitalize(req.params.paraId)

    const create = new List({
        name : paraId
    })

    List.findOne({name : paraId}, (err, listItem)=>{
        if(!err){
            if(listItem){
                res.render("list", {listTitle: paraId, todo : listItem.items})
            } else{
                create.save();
                res.redirect("/" + paraId); 
            }
        }
    })
})

app.post("/delete", (req, res)=>{
    const  checkboxId = req.body.checkbox;
    const  hiddenButton = req.body.hiddenButton

    if(hiddenButton === day){
        Todo.findByIdAndRemove(checkboxId, (err)=>{
            if(checkboxId){
                res.redirect("/");
            }
        }) 
    } else{
        List.findOneAndUpdate({name: hiddenButton}, {$pull : {items : {_id : checkboxId}}}, (err, todoslist)=>{
            if(!err){
                res.redirect("/" + hiddenButton);
            }
        })
    }
})

app.listen(process.env.PORT || port, ()=>{
    console.log(`Server is live at port ${port}`)
})

  