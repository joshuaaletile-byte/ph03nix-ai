const user = JSON.parse(localStorage.getItem("phoenixUser"));
const messages = document.getElementById("messages");

function speak(text){
    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";

    if(user.voice === "Female"){
        speech.pitch = 1.4;
    } else {
        speech.pitch = 0.8;
    }

    speechSynthesis.speak(speech);
}

function add(text){
    messages.innerHTML += "<p>"+text+"</p>";
}

function generateReply(input){

input = input.toLowerCase();

if(user.admin){
    return "Welcome back Joshua. Systems fully synchronized.";
}

if(user.personality === "Funny"){
    return "Hmm… interesting. Tell me more before I make jokes about it.";
}

if(user.personality === "Motivational"){
    return "You’ve got this. Keep going.";
}

if(user.personality === "Serious"){
    return "Analyzing your statement.";
}

if(user.personality === "Calm"){
    return "Let's take it step by step.";
}

return "I'm listening.";
}

function talk(){

const rec = new(window.SpeechRecognition||window.webkitSpeechRecognition)();
rec.start();

rec.onresult = e=>{
const text = e.results[0][0].transcript;

add("<b>You:</b> "+text);

const reply = generateReply(text);

add("<b>AI:</b> "+reply);

speak(reply);
};
}
