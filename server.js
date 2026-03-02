const express = require("express");
const fs = require("fs");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

function load(f){ return JSON.parse(fs.readFileSync(f)); }
function save(f,d){ fs.writeFileSync(f,JSON.stringify(d,null,2)); }

/* ================= USERS ================= */

app.post("/saveUser",(req,res)=>{
const users = load("users.json");

let user = req.body;

/* Detect Admin */
if(user.name.toLowerCase() === "joshua"){
    user.admin = true;
    user.mode = "JARVIS";
}else{
    user.admin = false;
    user.mode = "PH03NIX";
}

users[user.name]=user;
save("users.json",users);

res.sendStatus(200);
});

/* ================= MODE SWITCH ================= */

app.post("/switchMode",(req,res)=>{
const users = load("users.json");
const {name,mode} = req.body;

if(users[name] && users[name].admin){
    users[name].mode = mode;
    save("users.json",users);
}

res.sendStatus(200);
});

/* ================= MEMORY ================= */

app.post("/saveConversation",(req,res)=>{
const c = load("conversations.json");
c.push(req.body);
save("conversations.json",c);
res.sendStatus(200);
});

/* ================= TEACH ================= */

app.post("/teach",(req,res)=>{
const l = load("lessons.json");
l[req.body.question.toLowerCase()] = req.body.answer;
save("lessons.json",l);
res.sendStatus(200);
});

/* ================= THINK ENGINE ================= */

function generateJarvisResponse(input){

if(input.includes("status"))
return "All systems are functioning within normal parameters.";

if(input.includes("time"))
return "The current time is " + new Date().toLocaleTimeString();

if(input.includes("hello"))
return "Good day. It is a pleasure assisting you.";

return "How may I assist you further?";
}

function generatePhoenixResponse(){
return "System active and adapting.";
}

app.post("/ask",(req,res)=>{

const lessons = load("lessons.json");
const users = load("users.json");

const name = req.body.user;
const input = req.body.message.toLowerCase();

let user = users[name] || {admin:false,mode:"PH03NIX"};
let reply;

/* Learned answers first */
if(lessons[input]){
    reply = lessons[input];
}

/* ADMIN RESPONSES */
else if(user.admin && user.mode === "JARVIS"){
    reply = `Yes ${user.title}. ${generateJarvisResponse(input)}`;
}
else if(user.admin){
    reply = `Welcome back ${user.title}. ${generatePhoenixResponse(input)}`;
}

/* NORMAL USERS */
else{
    reply = lessons[input] || "I am learning. You may teach me.";
}

res.send({reply});
});

/* ================= TELEGRAM ================= */

const TOKEN = process.env.TELEGRAM_TOKEN;

app.post("/telegram", async (req,res)=>{
const msg = req.body.message;
if(!msg) return res.sendStatus(200);

const lessons = load("lessons.json");
const text = msg.text.toLowerCase();

let reply = lessons[text] || "I am learning. Teach me.";

await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`,{
method:"POST",
headers:{'Content-Type':'application/json'},
body: JSON.stringify({
chat_id:msg.chat.id,
text: reply + "\n\n— POWERED BY PH03NIX —"
})
});

res.sendStatus(200);
});

app.listen(process.env.PORT||3000);
