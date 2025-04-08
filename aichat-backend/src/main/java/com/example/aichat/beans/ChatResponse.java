package com.example.aichat.beans;

import lombok.Data;
import lombok.Builder;
import java.util.Date;
import java.util.List;

@Data
@Builder
public class ChatResponse {
    private Long conversationId;
    private String response;
    private List<Message> history;
    private Date timestamp;
}