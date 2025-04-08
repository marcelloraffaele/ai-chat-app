package com.example.aichat.beans;

import lombok.Data;
import java.util.List;

@Data
public class ChatRequest {
    private Long conversationId;
    private String message;
    private List<Message> history;
}