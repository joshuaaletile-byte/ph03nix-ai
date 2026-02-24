const messages = document.getElementById("messages");

function speak(text){
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 1;
    speech.pitch = 1;
    speech.lang = "en-US";
    speechSynthesis.speak(speech);
}

function addMessage(sender,text){
    messages.innerHTML += "<p><b>"+sender+":</b> "+text+"</p>";
    messages.scrollTop = messages.scrollHeight;
}

async function getReply(input){

    const res = await fetch("knowledge.json");
    const data = await res.json();

    input = input.toLowerCase();

    if(data[input]){
        return data[input];
    }

    // fallback thinking
    if(input.includes("sad")){
        return "Talk to me. What's wrong?";
    }

    if(input.includes("name")){
        return "I am PH03NIX AI.";
    }

    return "I'm still learning. Teach me that.";
}

function startListening(){

    const recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = async function(event){
        const text = event.results[0][0].transcript;

        addMessage("You",text);

        const reply = await getReply(text);

        addMessage("AI",reply);

        speak(reply);
    };
}
