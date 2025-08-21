from flask import Flask, request
from config import Config
from db import mongo
from routes.sentiment_route import sentiment_bp
from routes.user_route import user_bp
from routes.chatbot_route import chat_bot
# from routes.history_route import h
from routes.emotion_route import emotion_detection
from flask_cors import CORS
import nltk

# Download required NLTK data
nltk.download('punkt')
nltk.download('punkt_tab')

app = Flask(__name__)
app.config.from_object(Config)
mongo.init_app(app)

CORS(app, 
    resources={
        r"/*": {
            "origins": ["http://localhost:5173"],
            "methods": ["GET", "HEAD", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
            "allow_headers": ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
            "expose_headers": ["Content-Type", "X-Requested-With"],
            "supports_credentials": True,
            "send_wildcard": False
        }
    }
)

app.register_blueprint(sentiment_bp)
app.register_blueprint(user_bp)
app.register_blueprint(chat_bot)
# app.register_blueprint(history_bp)
app.register_blueprint(emotion_detection)

@app.after_request
def after_request(response):
    if request.method == 'OPTIONS':
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
        response.headers['Access-Control-Allow-Methods'] = 'GET, HEAD, POST, OPTIONS, PUT, PATCH, DELETE'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept, Origin, X-Requested-With'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Max-Age'] = '3600'
        response.status_code = 200
    return response

@app.route('/start_session', methods=['OPTIONS'])
def handle_options():
    response = app.make_default_options_response()
    return response

if __name__ == '__main__':
    app.run(debug=True, port=5001)
