from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__)

# ====== CONFIG ======
ADMIN_NAME = "JOSHUA"   # ← change to your name (must be lowercase)
current_mode = "PH03NIX"

# ====== SERVE WEBSITE ======
@app.route("/")
def home():
    return send_from_directory(".", "index.html")

@app.route("/chat.html")
def chat_page():
    return send_from_directory(".", "chat.html")

# ====== MODE SWITCH (ADMIN BUTTON) ======
@app.route("/set_mode", methods=["POST"])
def set_mode():
    global current_mode
    data = request.get_json()
    mode = data.get("mode", "PH03NIX")

    if mode in ["JARVIS", "PH03NIX"]:
        current_mode = mode

    return jsonify({"status": "mode changed", "mode": current_mode})

# ====== SIMPLE LOCAL "AI BRAIN" ======
def ph03nix_brain(message):
    msg = message.lower()

    if "hello" in msg:
        return "Hello. How can I assist you today?"

    elif "who are you" in msg:
        return "I am PH03NIX GRID, your intelligent assistant."

    elif "help" in msg:
        return "I can answer questions, guide you, and learn over time."

    elif "bye" in msg:
        return "Goodbye. POWERED BY PH03NIX."

    else:
        return f"You said: {message}"

def jarvis_brain(message, user):
    return f"At your service, Master {user}. I have processed: {message}"

# ====== CHAT ENDPOINT ======
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()

    message = data.get("message", "")
    user = data.get("user", "").lower()

    # Decide which personality to use
    if user == ADMIN_NAME and current_mode == "JARVIS":
        reply = jarvis_brain(message, user.capitalize())
    else:
        reply = ph03nix_brain(message)

    return jsonify({"reply": reply})

# ====== RUN SERVER ======
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
