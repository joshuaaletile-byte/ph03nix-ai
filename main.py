from flask import Flask, request, jsonify, send_from_directory
import os
import json

app = Flask(__name__)

# ===== CONFIG =====
ADMIN_NAME = "joshua"  # Admin name (lowercase)
current_mode = "PH03NIX"

# ===== MEMORY =====
CONVERSATION_FILE = "conversations.json"
if not os.path.exists(CONVERSATION_FILE):
    with open(CONVERSATION_FILE, "w") as f:
        f.write("[]")

# ===== SERVE WEBSITE =====
@app.route("/")
def home():
    return send_from_directory("website", "chat.html")

@app.route("/website/<path:filename>")
def website_files(filename):
    return send_from_directory("website", filename)

# ===== MODE SWITCH (ADMIN BUTTON) =====
@app.route("/set_mode", methods=["POST"])
def set_mode():
    global current_mode
    data = request.get_json()
    mode = data.get("mode", "PH03NIX")
    if mode in ["PH03NIX", "JARVIS"]:
        current_mode = mode
    return jsonify({"status": "ok", "mode": current_mode})

# ===== SAVE CONVERSATION =====
def save_conversation(user, message, reply):
    with open(CONVERSATION_FILE, "r") as f:
        history = json.load(f)
    history.append({"user": user, "message": message, "reply": reply})
    with open(CONVERSATION_FILE, "w") as f:
        json.dump(history, f, indent=2)

# ===== AI BRAIN =====
def ph03nix_brain(message):
    msg = message.lower()
    if "hello" in msg: return "Hello! How can I assist you today?"
    if "who are you" in msg: return "I am PH03NIX GRID, your intelligent assistant."
    if "help" in msg: return "I can answer questions and guide you through tasks."
    if "bye" in msg: return "Goodbye! POWERED BY PH03NIX."
    return f"You said: {message}"

def jarvis_brain(message, user):
    return f"At your service, Master {user}. I have processed: {message}"

# ===== CHAT ENDPOINT =====
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user = data.get("user", "")
    message = data.get("message", "")

    # Determine response
    if user.lower() == ADMIN_NAME and current_mode == "JARVIS":
        reply = jarvis_brain(message, user.capitalize())
    else:
        reply = ph03nix_brain(message)

    # Save conversation
    save_conversation(user, message, reply)
    return jsonify({"reply": reply})

# ===== RUN SERVER =====
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
