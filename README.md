# ai-chat-app
AI Chat is a chat backed by LLM model that help user to make intelligent things... content generation, RAG, image parsing...

Note: in the `main` branch the repository is initialized with only the structure of the project, the backend is a springboot project and the frontend is a react app with tailwindcss. The backend is not yet implemented, but you can use the prompts to generate the code for the backend and frontend. 


## Run the Demo locally
### Backend
```
cd aichat-backend
mvn spring-boot:run
```
### Frontend
```
cd aichat-frontend
npm install
npm run dev
```


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

Follow the instructions below:
1. Extract the swagger definition and save it in a file `api-definition.json`.
2. Using **GiHub Copilot Agent Mode**, select the **Claude 3.7** model and add as attachment the file `api-definition.json`, add the `aichat-frontend` folder and call the agent with the following prompt:
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

### Prompt 4 - add OpenAI from fetch
Use this prompt with Cloude 3.5 Sonnet:

```txt
using the documentation from #fetch https://learn.microsoft.com/en-us/java/api/overview/azure/ai-openai-readme?view=azure-java-preview , create an openAI client for Azure OpenAI GPT 4o mini, and implement the method generateAIResponse. env var are already defined in .env file.
```


### Prompt 4 - add OpenAI from prepared code

[Azure OpenAI client library for Java](https://learn.microsoft.com/en-us/java/api/overview/azure/ai-openai-readme?view=azure-java-preview#text-completions)

Remove the mock from the method `generateAIResponse` and add the following code:

Pom:
```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-ai-openai</artifactId>
    <version>1.0.0-beta.15</version>
</dependency>

```

Method:
```java
@Value("${AZURE_OPENAI_ENDPOINT}")
private String endpoint;

@Value("${AZURE_OPENAI_API_KEY}")
private String apiKey;

@Value("${AZURE_OPENAI_DEPLOYMENT_NAME}")
private String deploymentName;

/**
 * Generate AI response with Markdown support
 */
private String generateAIResponse(String userMessage, List<Message> history) {
    if (endpoint == null || apiKey == null) {
        System.err.println("OpenAI configuration is missing. Please check your .env file.");
        return "Error: Configuration missing, check the logs for more details.";
    }

    // Initialize the OpenAI client with key-based authentication
    OpenAIClient client = new OpenAIClientBuilder()
            .endpoint(endpoint)
            .credential(new AzureKeyCredential(apiKey))
            .buildClient();

    // Simulate chat interaction
    List<ChatRequestMessage> prompts = new ArrayList<>();
    
    // Add system message to encourage Markdown formatting
    prompts.add(new ChatRequestSystemMessage( 
        "You are a helpful assistant that provides well-formatted responses using Markdown. " +
        "Use appropriate Markdown syntax for: " +
        "- Headers (# for main points) " +
        "- Lists (- or 1. for steps) " +
        "- Code blocks (``` for multiline, ` for inline) " +
        "- **Bold** for emphasis " +
        "- *Italic* for technical terms " +
        "- > Blockquotes for important notes " +
        "- [Links](URL) when referencing external resources " +
        "Format your responses clearly and consistently using these elements."
    ));

    // Add previous messages to maintain context
    for (Message message : history) {
        if(message.getRole().equals("user")) {
            prompts.add(new ChatRequestUserMessage( message.getContent()));
        } else if(message.getRole().equals("assistant")) {
            prompts.add(new ChatRequestAssistantMessage( message.getContent()));
        }
    }

    prompts.add(new ChatRequestUserMessage( userMessage ));


    ChatCompletionsOptions options = new ChatCompletionsOptions(prompts)
            .setTemperature(0.7);   

    try {
        ChatCompletions chatCompletions = client.getChatCompletions(deploymentName, options);
        return chatCompletions.getChoices().get(0).getMessage().getContent();
    } catch (Exception e) {
        e.printStackTrace();
        System.out.println("Error: " + e.getMessage());
        return "Error: unexpected error occurred, see the logs for more details.";
    }
}

```


### Prompt 5 - add RAG

```java
@Value("${AZURE_OPENAI_SEARCH_ENDPOINT}")
    private String searchEndpoint;

    @Value("${AZURE_OPENAI_SEARCH_INDEX}")
    private String searchIndex;

    @Value("${AZURE_OPENAI_SEARCH_API_KEY}")
    private String searchApiKey;

    @Value("${AZURE_OPENAI_EMBEDDING_ENDPOINT}")
    private String embeddingEndpoint;

    @Value("${AZURE_OPENAI_EMBEDDING_KEY}")
    private String embeddingKey;


    ChatCompletionsOptions options = new ChatCompletionsOptions(prompts)
            .setTemperature(0.7)
            .setDataSources(List.of(  
                            new AzureSearchChatExtensionConfiguration( new AzureSearchChatExtensionParameters(searchEndpoint, searchIndex)
                            .setAuthentication( new  OnYourDataApiKeyAuthenticationOptions(searchApiKey))
                            .setQueryType(AzureSearchQueryType.VECTOR_SEMANTIC_HYBRID) //VECTOR or SIMPLE or VECTOR_SIMPLE_HYBRID
                            .setEmbeddingDependency( new OnYourDataEndpointVectorizationSource(embeddingEndpoint, new OnYourDataVectorSearchApiKeyAuthenticationOptions(embeddingKey)  ))
                            )  
                    )
            );   

```

RAG queries:
```
tell me something about workplace safety program
```

or
```
which are the differences between Northwind standard and Northwind health plus?
```

### Prompt 6 - citations
```java
ChatCompletions chatCompletions = client.getChatCompletions(deploymentName, options);
ChatChoice choice = chatCompletions.getChoices().get(0);
ChatResponseMessage respMessage = choice.getMessage();
AzureChatExtensionsMessageContext respMessageContext = respMessage.getContext();
List<AzureChatExtensionDataSourceResponseCitation> citations = respMessageContext.getCitations();
StringBuilder sb = new StringBuilder();
sb.append( respMessage.getContent() );

if (respMessageContext != null) {
    sb.append("\n\n**Citations:**\n");
    for (AzureChatExtensionDataSourceResponseCitation citation : citations) {
        sb.append(citation.getTitle());
        sb.append(" - ");
        sb.append(citation.getUrl());
        sb.append(" - ");
        sb.append(citation.getFilepath());
        sb.append(" - ");
        sb.append(citation.getRerankScore());
        sb.append(" - ");
        sb.append(citation.getChunkId());
        sb.append("\n");
    }
}
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
