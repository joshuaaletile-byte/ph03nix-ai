const user = JSON.parse(localStorage.getItem("phoenixUser"));
const box = document.getElementById("messages");

function add(sender,text){
box.innerHTML += `<p><b>${sender}:</b> ${text}</p>`;
box.scrollTop = box.scrollHeight;
}

function speak(text){
const s = new SpeechSynthesisUtterance(text);
s.pitch = user.voice === "Female" ? 1.3 : 0.8;
speechSynthesis.speak(s);
}

async function think(msg){

const res = await fetch("/ask",{
method:"POST",
headers:{'Content-Type':'application/json'},
body: JSON.stringify({message:msg,user:user.name})
});

return (await res.json()).reply;
}

async function talk(){

const rec = new(window.SpeechRecognition||webkitSpeechRecognition)();
rec.start();

rec.onresult = async e=>{
const text = e.results[0][0].transcript;

add("You",text);

const reply = await think(text);
const final = `${user.title}, ${reply}`;

add("PH03NIX",final);
speak(final);

fetch("/saveConversation",{
method:"POST",
headers:{'Content-Type':'application/json'},
body: JSON.stringify({user:user.name,message:text,reply:final})
});
};
}

async function teach(){
await fetch("/teach",{
method:"POST",
headers:{'Content-Type':'application/json'},
body: JSON.stringify({
question:document.getElementById("q").value,
answer:document.getElementById("a").value
})
});
alert("Learned.");
}
