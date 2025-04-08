package com.example.aichat.services;

import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.OpenAIClientBuilder;
import com.azure.ai.openai.models.*;
import com.azure.core.credential.AzureKeyCredential;
import com.example.aichat.beans.ChatRequest;
import com.example.aichat.beans.ChatResponse;
import com.example.aichat.beans.Message;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatService {
    private final Map<Long, List<Message>> conversationMap = new ConcurrentHashMap<>();

    @Value("${AZURE_OPENAI_ENDPOINT}")
    private String endpoint;

    @Value("${AZURE_OPENAI_API_KEY}")
    private String apiKey;

    @Value("${AZURE_OPENAI_DEPLOYMENT_NAME}")
    private String deploymentName;

    public ChatResponse handleChatCompletion(ChatRequest request) {
        Long conversationId = request.getConversationId();
        if (conversationId == null) {
            conversationId = generateConversationId();
        }

        List<Message> history = conversationMap.computeIfAbsent(conversationId, k -> new ArrayList<>());
        
        // Add user message to history
        Message userMessage = new Message("user", request.getMessage());
        history.add(userMessage);

        // Generate AI response
        String aiResponseText = generateAIResponse(request.getMessage(), history);
        Message aiMessage = new Message("assistant", aiResponseText);
        history.add(aiMessage);

        return ChatResponse.builder()
                .conversationId(conversationId)
                .response(aiResponseText)
                .history(new ArrayList<>(history))
                .timestamp(new Date())
                .build();
    }

    public List<Message> getConversationHistory(Long conversationId) {
        return conversationMap.getOrDefault(conversationId, new ArrayList<>());
    }

    private Long generateConversationId() {
        return System.currentTimeMillis();
    }

    private String generateAIResponse(String userMessage, List<Message> history) {
        if (endpoint == null || apiKey == null) {
            System.err.println("Azure OpenAI configuration is missing. Please check your .env file.");
            return "Error: Configuration missing, check the logs for more details.";
        }

        // Initialize the OpenAI client with key-based authentication
        OpenAIClient client = new OpenAIClientBuilder()
                .endpoint(endpoint)
                .credential(new AzureKeyCredential(apiKey))
                .buildClient();

        // Prepare chat messages
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
            if (message.getRole().equals("user")) {
                prompts.add(new ChatRequestUserMessage(message.getContent()));
            } else if (message.getRole().equals("assistant")) {
                prompts.add(new ChatRequestAssistantMessage(message.getContent()));
            }
        }

        // Add current user message
        prompts.add(new ChatRequestUserMessage(userMessage));

        ChatCompletionsOptions options = new ChatCompletionsOptions(prompts)
                .setTemperature(0.7);   

        try {
            ChatCompletions chatCompletions = client.getChatCompletions(deploymentName, options);
            return chatCompletions.getChoices().get(0).getMessage().getContent();
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error: " + e.getMessage());
            return "Error: An unexpected error occurred, see the logs for more details.";
        }
    }
}