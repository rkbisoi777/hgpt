const socket = io({
    transports: ['websocket', 'polling'],
    upgrade: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
});

const chatContainer = document.getElementById('chatContainer');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const stopButton = document.getElementById('stopButton');
let isSearching = false;
let currentResponse = '';
let currentMessageContent = null;

// Socket connection event handlers
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
    addSystemMessage('Disconnected from server. Attempting to reconnect...');
});

socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
    addSystemMessage('Connection error occurred');
});

socket.on('property_form', (data) => {
    console.log('Received property form:', data);
    removeTypingIndicator();
    chatContainer.appendChild(createForm(data.form));
    scrollToBottom();
});

socket.on('property_listing', (data) => {
    console.log('Received property listing:', data);
    removeTypingIndicator();
    chatContainer.appendChild(createMessage(data.data));
    scrollToBottom();
});

socket.on('bot_message', (data) => {
    console.log('Received bot message:', data);
    removeTypingIndicator();
    chatContainer.appendChild(createMessage(data.message));
    scrollToBottom();
    isSearching = false;
    sendButton.disabled = false;
    stopButton.style.display = 'none';
});

socket.on('error', (data) => {
    console.error('Received error:', data);
    chatContainer.appendChild(createMessage(`Error: ${data.message}`));
    isSearching = false;
    sendButton.disabled = false;
    stopButton.style.display = 'none';
    removeTypingIndicator();
    scrollToBottom();
});

function addSystemMessage(message) {
    const systemMessage = document.createElement('div');
    systemMessage.className = 'system-message';
    systemMessage.textContent = message;
    chatContainer.appendChild(systemMessage);
    scrollToBottom();
}

function createPropertyCard(property) {
    return `
        <div class="property-card">
            <div class="property-image" style="background-image: url('${property.images[0]}')">
                <div class="property-price">${property.price}</div>
            </div>
            <div class="property-content">
                <h3 class="property-title">${property.title}</h3>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i> ${property.location}
                </div>
                <p class="property-description">${property.description}</p>
                <div class="property-amenities">
                    ${property.amenities.map(amenity =>
        `<span class="amenity-tag">${amenity}</span>`
    ).join('')}
                </div>
                <a href="${property.source}" class="view-button">View Details</a>
            </div>
        </div>
    `;
}

// function createMessage(content, isUser = false) {
//     const message = document.createElement('div');
//     message.className = `message ${isUser ? 'user' : 'bot'}`;

//     const avatar = document.createElement('div');
//     avatar.className = 'avatar';
//     avatar.textContent = isUser ? 'U' : 'H';

//     const messageContent = document.createElement('div');
//     messageContent.className = 'message-content';

//     try {
//         const propertyData = JSON.parse(content);
//         if (propertyData.title && propertyData.price) {
//             messageContent.innerHTML = createPropertyCard(propertyData);
//         } else {
//             messageContent.textContent = content;
//         }
//     } catch (e) {
//         messageContent.textContent = content;
//     }

//     message.appendChild(avatar);
//     message.appendChild(messageContent);
//     return message;
// }

function createMessage(content, isUser = false) {
    const message = document.createElement('div');
    message.className = `message ${isUser ? 'user' : 'bot'}`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';

    if (isUser) {
        avatar.textContent = 'U'; // For User, showing 'U'
    } else {
        // For AI (Bot), displaying an SVG icon
        avatar.innerHTML = `
            <svg fill="#FFFFFF" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                 width="24px" height="24px" viewBox="0 0 66.201 66.201" xml:space="preserve">
                <g>
                    <g>
                        <path d="M65.597,34.7L51.779,20.884v-9.112c0-1.136-0.92-2.057-2.058-2.057c-1.135,0-2.056,0.921-2.056,2.057v5.001l-9.748-9.748
                            c-0.803-0.802-2.104-0.802-2.906,0L16.146,25.892c1.547,0.269,3.021,0.754,4.386,1.427l15.935-15.934l26.225,26.223
                            c0.398,0.4,0.926,0.603,1.453,0.603c0.523,0,1.051-0.199,1.451-0.603C66.402,36.805,66.402,35.504,65.597,34.7z"/>
                        <path d="M59.716,37.06L37.921,15.264c-0.388-0.385-0.908-0.603-1.453-0.603c-0.546,0-1.067,0.218-1.453,0.603l-12.93,12.932
                            c4.533,2.893,7.55,7.963,7.55,13.729c0,2.404-0.527,4.754-1.539,6.903l3.626,3.627c0.113,0.112,0.217,0.23,0.319,0.353
                            c0.708-0.881,1.098-1.967,1.098-3.104v-7.812c0-1.896,1.453-3.48,3.33-3.658c1.877,0.178,3.33,1.762,3.33,3.658v7.812
                            c0,1.252,0.473,2.45,1.325,3.372c0.938,1.017,2.267,1.599,3.646,1.599h10.637c2.74,0,4.971-2.229,4.971-4.971V39.066
                            c0-0.312-0.03-0.628-0.092-0.942C60.203,37.721,60.007,37.351,59.716,37.06z"/>
                        <path d="M24.475,49.327c1.417-2.121,2.246-4.668,2.246-7.402c0-7.368-5.993-13.362-13.36-13.362S0,34.556,0,41.925
                            c0,7.366,5.994,13.357,13.361,13.357c2.4,0,4.65-0.638,6.599-1.75l5.343,5.344c0.602,0.604,1.391,0.902,2.18,0.902
                            s1.578-0.302,2.179-0.902c1.204-1.203,1.204-3.156,0-4.359L24.475,49.327z M13.361,51.175c-5.1,0-9.25-4.149-9.25-9.25
                            c0-5.103,4.15-9.25,9.25-9.25s9.25,4.148,9.25,9.25C22.61,47.022,18.46,51.175,13.361,51.175z"/>
                    </g>
                </g>
            </svg>
        `;
    }

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    try {
        const propertyData = JSON.parse(content);
        if (propertyData.title && propertyData.price) {
            messageContent.innerHTML = createPropertyCard(propertyData);
        } else {
            messageContent.textContent = content;
        }
    } catch (e) {
        messageContent.textContent = content;
    }

    message.appendChild(avatar);
    message.appendChild(messageContent);
    return message;
}


function createForm(formData) {
    const form = document.createElement('div');
    form.className = 'message bot';

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = 'A';

    const formElement = document.createElement('form');
    formElement.className = 'message-content';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Name';
    nameInput.value = formData.name;
    nameInput.required = true;

    const phoneInput = document.createElement('input');
    phoneInput.type = 'tel';
    phoneInput.placeholder = 'Phone';
    phoneInput.value = formData.phone;
    phoneInput.required = true;

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.placeholder = 'Email';
    emailInput.value = formData.email;
    emailInput.required = true;

    const cityInput = document.createElement('input');
    cityInput.type = 'text';
    cityInput.placeholder = 'City';
    cityInput.value = formData.city;
    cityInput.required = true;

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';

    formElement.appendChild(nameInput);
    formElement.appendChild(phoneInput);
    formElement.appendChild(emailInput);
    formElement.appendChild(cityInput);
    formElement.appendChild(submitButton);

    form.appendChild(avatar);
    form.appendChild(formElement);

    formElement.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = {
            name: nameInput.value,
            phone: phoneInput.value,
            email: emailInput.value,
            city: cityInput.value
        };
        socket.emit('submit_form', formData);
        form.remove();
    });

    return form;
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
    }
}

function handleSendMessage() {
    if (isSearching) return;

    const message = chatInput.value.trim();
    if (!message) return;

    console.log('Sending message:', message);
    chatContainer.appendChild(createMessage(message, true));
    chatInput.value = '';
    scrollToBottom();

    isSearching = true;
    currentResponse = '';
    currentMessageContent = null;
    addTypingIndicator();
    sendButton.disabled = true;
    stopButton.style.display = 'inline-block';

    socket.emit('user_message', { message });
}

function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function handleStopStream() {
    socket.emit('stop_stream');
    stopButton.style.display = 'none';
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

function addTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typingIndicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    chatContainer.appendChild(indicator);
    indicator.style.display = 'block';
    scrollToBottom();
}

// Initialize
chatInput.focus();