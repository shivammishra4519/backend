
let express = require('express')
let mongoose = require('mongoose')
let dbconect = require('./dbcon')
let schema = require('./Schema')
let mongodb = require('mongodb')
let app = express()

dbconect.dbconect()
app.use(express.static('./public'));
app.use(express.json())
var cors = require('cors');
app.use(cors());

app.get("/", (req, res) => {
    res.send("server is runing on port number 8080")
})


// get api start here 
app.get("/task", async (req, res) => {
    try {
        let data = await schema.find({})
        res.json(data)
    } catch (err) {
        res.status(404).send(err)
    }

})
// get api ends here 

// get api for find by id

app.get('/task/:id', async(req,res)=>{
    try{
        let id=req.params.id;
        let data=await schema.findById({_id:id})
        res.json(data)

    }catch(err){
        res.status(404).send(err)
    }
})
app.get('/search/:key', async(req,res)=>{
    try{

        let key = await req.params.key;
        let data=await schema.find({
            "$or":[
                {taskName:{$regex:key}}
            ]
        })
        res.json(data)

    }catch(err){
        res.status(404).send(err)
    }
})

// get api for findy by name

// post api  start
app.post("/task", async (req, res) => {
    try {
        let data = req.body;
        let rseponse = await schema.create(data)
        console.log(data)
        res.json({
            data: rseponse
            , message: "data recied succesfuly"
        })
        console.log(data)
    } catch (err) {
        res.status(404).send(err)
    }


})
// post api end

// delet api start 
app.delete("/task/:id", async (req, res) => {
    try {
        let id = req.body;
        let deletedTask = await schema.deleteOne({ _id: new mongodb.ObjectId(req.params.id) })
        res.json({ deletedTask })
    } catch (err) {
        res.status(404).send(err)
    }
})
// delete api end


// patch api start
app.patch("/task/:id", async (req, res) => {
    try {
        const _id = req.params.id;
        const update = await schema.findByIdAndUpdate(_id, req.body, { new: true })
        res.send(update)
    } catch (err) {
        res.status(404).send(err)
    }
})
// delete api end


// server is listen
app.listen(8080, () => {
    console.log("server is created")
})






