# GraphQL API with Apollo Server

This is a robust, modular GraphQL API built with Node.js and Apollo Server. It features JWT Authentication and a "Task" resource management system.

## 🚀 Features

- **GraphQL API**: Query and Mutate data precisely.
- **Authentication**: Secure `register` and `login` with JWT.
- **Modular Architecture**: Clean separation of TypeDefs, Resolvers, and Models.
- **Mock Database**: In-memory data persistence (simulating a database).

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Server**: @apollo/server
- **Language**: GraphQL (SDL)
- **Auth**: jsonwebtoken, bcryptjs

## 📦 Installation

1.  **Install Dependencies**

    ```bash
    npm install
    ```

2.  **Environment Setup**
    Ensure `.env` exists:

    ```env
    JWT_SECRET=mycustomsecretkey123
    PORT=4000
    ```

3.  **Run Server**
    ```bash
    npm start
    ```
    Values: `http://localhost:4000`

## 🧪 Usage (Apollo Sandbox)

Open `http://localhost:4000` to access the Playground.

### 1. Register a User

```graphql
mutation {
  register(email: "test@test.com", password: "password123") {
    token
    user {
      id
      email
    }
  }
}
```

### 2. Login

```graphql
mutation {
  login(email: "test@test.com", password: "password123") {
    token
  }
}
```

### 3. Create a Task (Authenticated)

_Header_: `Authorization: Bearer <YOUR_TOKEN>`

```graphql
mutation {
  createTask(title: "Learn GraphQL", description: "Master resolvers") {
    id
    title
    user {
      email
    }
  }
}
```

### 4. Query Tasks

```graphql
query {
  tasks {
    id
    title
    completed
  }
}
```
