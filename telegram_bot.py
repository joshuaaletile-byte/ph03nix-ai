import requests
import time
import json
import os

TOKEN = "YOUR_TELEGRAM_BOT_TOKEN"
BASE_URL = f"https://api.telegram.org/bot{TOKEN}"

ADMIN_NAME = "joshua"
current_mode = "PH03NIX"

def ph03nix_brain(message):
    msg = message.lower()
    if "hello" in msg: return "Hello! How can I assist you today?"
    if "who are you" in msg: return "I am PH03NIX GRID, your intelligent assistant."
    if "help" in msg: return "I can answer questions and guide you through tasks."
    if "bye" in msg: return "Goodbye! POWERED BY PH03NIX."
    return f"You said: {message}"

def jarvis_brain(message,user):
    return f"At your service, Master {user}. I have processed: {message}"

def get_updates(offset=None):
    url = f"{BASE_URL}/getUpdates?timeout=100"
    if offset:
        url += f"&offset={offset}"
    r = requests.get(url)
    return r.json()

def send_message(chat_id,text):
    requests.post(f"{BASE_URL}/sendMessage", json={"chat_id":chat_id,"text":text+"\n\n— POWERED BY PH03NIX —"})

def main():
    offset = None
    while True:
        updates = get_updates(offset)
        for u in updates.get("result",[]):
            offset = u["update_id"] + 1
            if "message" not in u: continue
            msg = u["message"]
            text = msg.get("text","")
            chat_id = msg["chat"]["id"]
            user = msg["from"]["first_name"]

            if user.lower() == ADMIN_NAME and current_mode=="JARVIS":
                reply = jarvis_brain(text,user)
            else:
                reply = ph03nix_brain(text)

            send_message(chat_id,reply)
        time.sleep(1)

if __name__=="__main__":
    main()
