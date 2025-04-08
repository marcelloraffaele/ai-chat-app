package com.example.aichat.controllers;

import com.example.aichat.beans.ChatRequest;
import com.example.aichat.beans.ChatResponse;
import com.example.aichat.beans.Message;
import com.example.aichat.services.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "*")
@Tag(name = "Chat", description = "Chat API endpoints")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/completion")
    @Operation(summary = "Send a message and get AI response")
    public ChatResponse chatCompletion(@RequestBody ChatRequest request) {
        return chatService.handleChatCompletion(request);
    }

    @GetMapping("/history/{conversationId}")
    @Operation(summary = "Get chat history for a conversation")
    public List<Message> getChatHistory(@PathVariable Long conversationId) {
        return chatService.getConversationHistory(conversationId);
    }
}