# ai-chat-app
AI Chat is a chat backed by LLM model that help user to make intelligent things... content generation, RAG, image parsing...

## Demo Github copilot
### Prompt 1
Using **Claude Sonnet 3.5**, in GitHub copilot edit in agent mode, add the `aichat-backend` folder and  run the following prompt:

```
create a Spring boot controller expose and API for a AI chat application.
Create a `beans` folder and:
    - add a `ChatRequest` class with the following fields: conversationId:long, message:String, history:List<Message>
    - Add `Message` class with fields: role: String, content:String
    - Add a `ChatResponse` class with fields: conversationId:long, response:String, history:List<Message>, timestamp:Date

Create a `controllers` folder and add a `ChatController` that implements the REST service with the following methods:
- POST /chat/completion: call the ChatService method passing in input a ChatRequest and getting in output a ChatResponse.
- GET /chat/history/<conversationId> : get the chat history with the conversationId
Disable all cors check, enable all the origins.
Generate swagger dependency classes in order to get the documentation of this API.
If added libraries, update all the dependency.

Create a `services` folder and add a `ChatService` that will manage a conversationMap: Map<Long,List<Message>>. The key is the conversationID, when a request arrive, if not present the conversationID it will create a new map entry. For the moment for the completion, create a mock method called `generateAIResponse` that return the string "AI response " + message .
```

### Prompt 2 - client generation
```
For each of the controllers api, generate the following curl and save a file named `client.rest`: 
    1. Get the open api definition
    2. Create a curl test of each API.
```

### Prompt 3 - frontend
In GitHub copilot edit in agent mode, add the `aichat-frontend` folder and  run the following prompt:
```
Create a modern, responsive frontend for an AI chat application inspired by the clean, minimalistic design of ChatGPT.
The frontend should be built using React and must use Tailwind. Tailwind is already configured, don't configure it.
The interface should include the following features:
1. A fixed header with a title (e.g., 'AI Chat') and a 'New Chat' button in the sidebar. Each chat will have a conversationId that will start from 1.
2. A main chat area that displays a scrollable history of messages: user messages on the right (in a distinct color like blue), AI responses on the left (in a neutral color like gray), with smooth scrolling for long conversations. Markdown format must be handled for messages.
3. A text input field at the bottom with a 'Send' button and support for pressing 'Enter' to submit the message.
4. A loading indicator (e.g., animated dots or spinner) to show when the AI is processing a response.
5. Basic styling: clean typography (e.g., sans-serif fonts like Inter or Roboto), subtle shadows, rounded corners, and a light/dark mode toggle.
6. The frontend should make API calls to a backend service to send user messages and receive AI responses. Use as API the openapi spec provided and split the implementation into components and put the REST client in a folder named `services`. The API maintain a history of previous chat messages for context.
Include comments in the code to explain key sections. Provide the full code for the frontend, and ensure it’s functional, reusable, and easy to integrate with a backend API that keeps track of previous messages.
```

### Prompt 4 - add OpenAI

Remove the mock from the method `generateAIResponse` and add the following code:

Pom:
```
```

Method:
```

```


### Prompt 5 - add RAG

Query ai-chat:
```
tell me something about workplace safety program
```

or
```
which are the differences between Northwind standard and Northwind health plus?
```


## Basic configuration
```bash
# Backend
# goto springboot initializr and create a springboot project https://start.spring.io/index.html

# frontend
## create the react app with vite
npm create vite@latest aichat-frontend --template react
## setup the project with tailwindcss
npm install tailwindcss @tailwindcss/vite
### follow this instructions https://tailwindcss.com/docs/installation/using-vite
```
