# Project structure
The project is composed of two main parts: the backend and the frontend.
- The backend is a Java Spring Boot application that handles the business logic and data storage. Everything related to the backend is in the `aichat-backend` folder.
- The frontend is a React application that provides the user interface and communicates with the backend. Everything related to the frontend is in the `aichat-frontend` folder.
Every time you need to run a command, make sure to run it in the correct folder. For example, if you need to run a command related to the backend, make sure you are in the `aichat-backend` folder.

# Stack
- Java (Spring Boot)
- React
- Vite
- TypeScript
- Tailwind CSS

## Java
In Java always use Maven as build tool and JUnit as test framework.
In Java always use UPPERCASE for `private static` field names.
In Java always use camelCase for field names and method names.
For `Beans` always generate getters and setters.

## Tailwind
The way to import Tailwind in `.css` files is this:
```
@import "tailwindcss";
```
it is already imported in `App.css` file don't import it again.