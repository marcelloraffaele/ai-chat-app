# AI Chat Project
This project is an AI Chat application that allows users to interact with an AI model.
The application is designed to be modular and easy to maintain, with a clear separation between the backend and frontend components. 
The project uses modern technologies and best practices to ensure a smooth development experience.

## Project Structure
The project is composed of two main parts: the backend and the frontend.
Folders:
- `aichat-backend`: Contains the Java Spring Boot application that handles the business logic and data storage.
- `aichat-frontend`: Contains the React application that provides the user interface and communicates with the backend.

Every time you need to run a command, make sure to run it in the correct folder. 
For example, if you need to run a command related to the backend build, make sure you run a `cd aichat-backend && mvn clean install` command.

## Stack
- Java (Spring Boot)
- React
- Vite
- TypeScript
- Tailwind CSS

## Key Guidelines
1. Follow Go best practices and idiomatic patterns
2. Maintain existing code structure and organization
3. Use meaningful names for variables, functions, and components
4. Write clear and concise comments where necessary

## Java guidelines
In Java always use Maven as build tool and JUnit as test framework.
In Java always use UPPERCASE for `private static` field names.
In Java always use camelCase for field names and method names.
For `Beans` always generate getters and setters.

## Tailwind guidelines
The way to import Tailwind in `.css` files is this:
```
@import "tailwindcss";
```
it is already imported in `App.css` file don't import it again.