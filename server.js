const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post("/saveUser", (req,res)=>{
    const user = req.body;

    const data = JSON.parse(fs.readFileSync("users.json"));
    data[user.name] = user;

    fs.writeFileSync("users.json", JSON.stringify(data,null,2));

    res.send({status:"saved"});
});

app.get("/getUser/:name",(req,res)=>{
    const data = JSON.parse(fs.readFileSync("users.json"));
    res.send(data[req.params.name] || {});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("PH03NIX-GRID Running"));
