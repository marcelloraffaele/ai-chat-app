#!/bin/bash

# Update PATH to include Maven and Node.js
echo 'export PATH="$PATH:$HOME/.sdkman/candidates/maven/current/bin:$HOME/.sdkman/candidates/nodejs/current/bin"' >> ~/.bashrc

# Initialize the backend
echo "Setting up Java backend..."
cd /workspaces/ai-chat-app/aichat-backend
./mvnw clean package -DskipTests

# Initialize the frontend
echo "Setting up React frontend..."
cd /workspaces/ai-chat-app/aichat-frontend
npm install

echo "Development environment is ready!"