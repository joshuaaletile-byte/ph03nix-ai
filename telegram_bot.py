import requests
import time

TOKEN = "YOUR_TELEGRAM_BOT_TOKEN"
BASE = f"https://api.telegram.org/bot{TOKEN}"

AI_URL = "https://phoenix-brain.onrender.com/chat"

def send(chat_id,text):
    requests.post(f"{BASE}/sendMessage",json={
        "chat_id":chat_id,
        "text":text+"\n\n— POWERED BY PH03NIX —"
    })

def updates(offset=None):
    return requests.get(f"{BASE}/getUpdates",params={"offset":offset,"timeout":100}).json()

offset=None

while True:
    data=updates(offset)

    for item in data["result"]:
        offset=item["update_id"]+1

        msg=item["message"]["text"]
        chat_id=item["message"]["chat"]["id"]
        user=item["message"]["from"]["first_name"]

        res=requests.post(AI_URL,json={
            "user":user,
            "message":msg,
            "admin":False,
            "mode":"PH03NIX"
        }).json()

        send(chat_id,res["reply"])

    time.sleep(1)
