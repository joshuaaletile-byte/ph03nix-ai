const express = require("express");
const fs = require("fs");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

/* =========================
   USER MEMORY (already exists)
========================= */

app.post("/saveUser", (req,res)=>{
    const user = req.body;
    const data = JSON.parse(fs.readFileSync("users.json"));
    data[user.name] = user;
    fs.writeFileSync("users.json", JSON.stringify(data,null,2));
    res.send({status:"saved"});
});

/* =========================
   AI RESPONSE ENGINE
========================= */

function generateReply(input, username="Guest"){

input = input.toLowerCase();

if(username.toLowerCase() === "joshua"){
    return "Admin Joshua detected. PH03NIX-GRID fully aligned.";
}

if(input.includes("hello"))
    return "Hello. I am PH03NIX-GRID.";

if(input.includes("who are you"))
    return "I am an adaptive intelligence built without external AI.";

if(input.includes("sad"))
    return "Talk to me. You are not alone.";

return "Processing that. Tell me more.";
}

/* =========================
   TELEGRAM WEBHOOK
========================= */

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

app.post("/telegram", async (req,res)=>{

const msg = req.body.message;

if(!msg) return res.sendStatus(200);

const chatId = msg.chat.id;
const text = msg.text || "";
const username = msg.from.first_name;

const reply = generateReply(text, username);

await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,{
method:"POST",
headers:{'Content-Type':'application/json'},
body: JSON.stringify({
chat_id: chatId,
text: reply
})
});

res.sendStatus(200);
});

/* ========================= */

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("PH03NIX-GRID Running"));
