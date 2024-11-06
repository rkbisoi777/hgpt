import os
from flask import Flask, render_template, session, request, jsonify
from flask_socketio import SocketIO, emit
from langchain.schema import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langchain_core.callbacks import BaseCallbackHandler
import re
import json
from engineio.payload import Payload

# Increase max payload size
Payload.max_decode_packets = 50

class StreamingSocketCallback(BaseCallbackHandler):
    def __init__(self, socketio, room=None):
        self.socketio = socketio
        self.room = room
        self.collected_text = ""
        self.user_info = None
        
    def on_llm_new_token(self, token: str, **kwargs):
        self.collected_text += token
        try:
            if self.collected_text.strip().startswith("{") and self.collected_text.strip().endswith("}"):
                json_data = json.loads(self.collected_text)
                if "form" in json_data:
                    self.user_info = json_data["form"]
                    self.socketio.emit('property_form', json_data, room=self.room)
                else:
                    self.socketio.emit('property_listing', {'data': self.collected_text}, room=self.room)
            else:
                self.socketio.emit('stream_chunk', {'chunk': token}, room=self.room)
        except json.JSONDecodeError:
            self.socketio.emit('stream_chunk', {'chunk': token}, room=self.room)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'aJXgBz7YC9oLQ6UhFZl18xXTMsqXH3fu'
socketio = SocketIO(app, 
                   cors_allowed_origins="*",
                   ping_timeout=60,
                   ping_interval=25,
                   async_mode='threading',
                   logger=True,
                   engineio_logger=True)

def get_chat_model(callback_handler):
    return ChatOpenAI(
        openai_api_key='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',
        streaming=True,
        callbacks=[callback_handler],
        temperature=0.7,
        model_name="gpt-3.5-turbo"
    )

def format_agent_prompt(user_info=None):
    system_prompt = """You are an Indian property agent assistant. Follow these rules:
    1. Always respond in a helpful and professional manner
    2. When showing properties, use EXACTLY this JSON format for EACH property:
    {
        "title": "Property Name and Type",
        "price": "Price in Indian format",
        "location": "Specific area and city",
        "description": "Key features and benefits",
        "amenities": ["amenity1", "amenity2"],
        "images": ["/api/placeholder/400/300"],
        "source": "#"
    }
    3. If user hasn't provided their information, ask for:
       - Name
       - Phone number
       - Email
       - City of interest
    4. Keep responses conversational and natural when not listing properties"""
    
    if user_info:
        system_prompt += f"\nCurrent user: {user_info['name']} from {user_info['city']}"
    
    return SystemMessage(content=system_prompt)

def extract_user_info(message):
    patterns = {
        'name': r'Name:\s*(.+?)(?=Phone:|Email:|City:|$)',
        'phone': r'Phone:\s*(.+?)(?=Name:|Email:|City:|$)',
        'email': r'Email:\s*(.+?)(?=Name:|Phone:|City:|$)',
        'city': r'City:\s*(.+?)(?=Name:|Phone:|Email:|$)'
    }
    
    info = {}
    for field, pattern in patterns.items():
        match = re.search(pattern, message, re.I | re.S)
        if match:
            info[field] = match.group(1).strip()
    
    return info if len(info) == 4 else None

@socketio.on('connect')
def handle_connect():
    print("Client connected")
    session['user_info'] = None
    emit('bot_message', {
        'message': "Namaste! 🙏 I'm your AI Property Agent. Your property search ends here. How can I help you find your ideal property today?"
    })

@socketio.on('disconnect')
def handle_disconnect():
    print("Client disconnected")

@socketio.on('user_message')
def handle_message(data):
    print(f"Received message: {data}")
    try:
        message = data.get('message', '').strip()
        if not message:
            emit('error', {'message': 'Please enter a message'})
            return

        user_info = session.get('user_info')
        print(f"Current user info: {user_info}")

        # Step 1: Verify if the query contains property-related information (location and property config)
        property_query_verified = verify_property_query(message)
        if property_query_verified:
            # Step 2: If the property query is verified, ask the user for their details
            if not user_info:
                # User details not yet collected, ask the user to fill out the form
                response = "Found 5 matching properties. Please fill out the form below to proceed."
                print(f"Sending response: {response}")
                emit('bot_message', {'message': response})
                emit('property_form', {
                    'form': {
                        'name': '',
                        'phone': '',
                        'email': '',
                        'city': ''
                    }
                })
                return
            else:
                # If user info exists, proceed to process the query
                response = "Thank you for filling out the form. Let me process your query and show you the matching properties."
                print(f"Sending response: {response}")
                emit('bot_message', {'message': response})
                # Proceed to use OpenAI to process the query and provide property listings
                callback_handler = StreamingSocketCallback(socketio)
                callback_handler.user_info = user_info
                chat = get_chat_model(callback_handler)

                # Assuming you have a function to generate the agent's prompt based on user info
                messages = [
                    format_agent_prompt(user_info),
                    HumanMessage(content=message)
                ]

                print("Starting chat response")
                emit('typing_start')
                response = chat(messages)
                print(f"Chat response completed: {response}")
                emit('typing_end')
                return
        else:
            # Step 3: If the query is not valid, ask for more details
            emit('bot_message', {'message': "Please provide more information about the property you are looking for (location, type, budget, etc.)."})
            return

    except Exception as e:
        print(f"Error in handle_message: {str(e)}")
        emit('error', {'message': 'An error occurred while processing your request'})


# Function to verify the query
def verify_property_query(message):
    # Check if the message contains location and property config information
    location_pattern = r'(in|near)\s*(\w+|\w+\s\w+)'  # e.g., "in Mumbai", "near Delhi"
    property_config_pattern = r'(apartment|house|villa|office|shop|land|bhk|rk)'  # Basic property types

    location_match = re.search(location_pattern, message, re.I)
    property_config_match = re.search(property_config_pattern, message, re.I)
    
    return location_match and property_config_match

@socketio.on('submit_form')
def handle_form_submit(data):
    print(f"Received form data: {data}")
    
    # Verify that all fields are filled out
    if not all(field in data and data[field] for field in ['name', 'phone', 'email', 'city']):
        emit('bot_message', {'message': "Please fill out all the required fields (Name, Phone, Email, City)."})
        return
    
    # Save user info and process query with OpenAI (Langchain)
    save_user_info(data)
    session['user_info'] = data
    emit('bot_message', {'message': "Thank you for providing your information. Let me show you some property listings that match your requirements."})

    # Step 3: Process the query and fetch property listings
    callback_handler = StreamingSocketCallback(socketio)
    callback_handler.user_info = data
    chat = get_chat_model(callback_handler)
    
    # Construct the prompt to send to OpenAI
    messages = [
        format_agent_prompt(data),
        HumanMessage(content="Show me some properties in the city of " + data['city'])
    ]
    
    print("Starting chat response")
    emit('typing_start')
    response = chat(messages)
    print(f"Chat response completed: {response}")
    emit('typing_end')
    
    # Step 4: Assuming response is the property listings, send them as cards
    # Placeholder for the actual property listings:
    properties = [
        {
            'title': 'Beautiful 2BHK in Mumbai',
            'price': '₹1,20,00,000',
            'location': 'Mumbai, Maharashtra',
            'description': 'A luxurious 2BHK apartment in the heart of the city with modern amenities.',
            'amenities': ['Swimming Pool', 'Gym', 'Parking'],
            'images': ['/api/placeholder/400/300'],
            'source': '#'
        },
        # Add more properties here...
    ]
    
    emit('property_listings', {'properties': properties})


def save_user_info(user_info):
    data_dir = 'user_data'
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
    
    file_path = os.path.join(data_dir, 'user_info.json')
    with open(file_path, 'w') as file:
        json.dump(user_info, file, indent=2)

@socketio.on_error()
def error_handler(e):
    print(f"SocketIO error: {str(e)}")
    emit('error', {'message': 'An error occurred'})

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    socketio.run(app, 
                debug=True, 
                host='0.0.0.0', 
                port=5555)  # Only use in development