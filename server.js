const express = require("express");
const fs = require("fs");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

function load(f){ return JSON.parse(fs.readFileSync(f)); }
function save(f,d){ fs.writeFileSync(f,JSON.stringify(d,null,2)); }

/* USERS */
app.post("/saveUser",(req,res)=>{
const users = load("users.json");
users[req.body.name]=req.body;
save("users.json",users);
res.sendStatus(200);
});

/* MEMORY */
app.post("/saveConversation",(req,res)=>{
const c = load("conversations.json");
c.push(req.body);
save("conversations.json",c);
res.sendStatus(200);
});

/* TEACH */
app.post("/teach",(req,res)=>{
const l = load("lessons.json");
l[req.body.question.toLowerCase()] = req.body.answer;
save("lessons.json",l);
res.sendStatus(200);
});

/* THINK */
app.post("/ask",(req,res)=>{
const lessons = load("lessons.json");
const input = req.body.message.toLowerCase();

let reply = lessons[input] || "I am learning. Teach me that.";
res.send({reply});
});

/* TELEGRAM */
const TOKEN = process.env.TELEGRAM_TOKEN;

app.post("/telegram", async (req,res)=>{
const msg = req.body.message;
if(!msg) return res.sendStatus(200);

const lessons = load("lessons.json");
const text = msg.text.toLowerCase();
const reply = lessons[text] || "Teach me more.";

await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`,{
method:"POST",
headers:{'Content-Type':'application/json'},
body: JSON.stringify({chat_id:msg.chat.id,text:reply})
});

res.sendStatus(200);
});

app.listen(process.env.PORT||3000);
