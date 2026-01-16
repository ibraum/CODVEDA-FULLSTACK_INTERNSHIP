# 🚀 The Ultimate GraphQL Learning Guide

Welcome to your step-by-step guide to mastering GraphQL. This note is structured to take you from a complete beginner to building scalable APIs.

---

## 📚 Part 1: The Theory (Understand the "Why")

### 1. What is GraphQL?

GraphQL is a query language for your API. Unlike REST, where you have multiple endpoints (URLs), GraphQL has **one endpoint**. You send a query to this endpoint asking for exactly what you need, and you get exactly that back.

### 2. GraphQL vs REST

| Feature           | REST API                                   | GraphQL API                           |
| ----------------- | ------------------------------------------ | ------------------------------------- |
| **Data Fetching** | You might get too much or too little data. | You get **exactly** what you ask for. |
| **Endpoints**     | Many (`/users`, `/posts`, `/comments`)     | **One** (`/graphql`)                  |
| **Versioning**    | Hard (v1, v2, v3...)                       | **None** (deprecated fields)          |
| **Performance**   | Multiple round-trips often needed.         | Single request.                       |

### 3. Key Concepts (The Dictionary)

- **Schema**: The blueprint. It defines what data exists (Types) and what clients can do (Queries/Mutations).
- **Query**: "I want to **READ** data." (Like `GET` in REST).
- **Mutation**: "I want to **CHANGE** data." (Like `POST`, `PUT`, `DELETE`).
- **Resolver**: The function that actually goes and fetches the data (from a DB, APIs, etc.).

---

## 🛠️ Part 2: Level 1 - Your First Server (The Simple Way)

_Best for: Learning, small projects, and prototyping._

### Step 1: Initialize Project

Open your terminal and run:

```bash
mkdir my-graphql-server
cd my-graphql-server
npm init -y
npm install @apollo/server graphql
```

_Note: Add `"type": "module"` to your `package.json` to use modern `import` syntax._

### Step 2: Write the Code (All-in-One)

Create an `index.js` file. We will define the schema using **SDLStrings** (Schema Definition Language), which is very readable.

```javascript
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// 1. THE DATA (Mock Database)
const books = [
  { title: "The Awakening", author: "Kate Chopin" },
  { title: "City of Glass", author: "Paul Auster" },
];

// 2. THE SCHEMA (String format)
const typeDefs = `#graphql
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

// 3. THE RESOLVERS (Logic)
const resolvers = {
  Query: {
    books: () => books,
  },
};

// 4. THE SERVER
const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`🚀 Server ready at: ${url}`);
```

### Step 3: Run It

```bash
node index.js
```

Go to `http://localhost:4000` to test your query!

---

## 🚀 Part 3: Level 2 - Professional Structure (The Scalable Way)

_Best for: Real-world apps, complex data, and avoiding massive files._

In big projects, string schemas get messy. We use the **Programmatic (Code-First) Approach** to split code into modules.

### 1. Project Structure

Create this folder structure:

```
/src
  /schema
    UserType.js
    SchoolType.js
    RootQuery.js
    RootMutation.js
  db.js         # Your data
  schema.js     # Merges everything
  index.js      # Server entry
```

### 2. Define Data (`db.js`)

```javascript
export const users = [{ id: "1", username: "Ali", schoolId: "101" }];
export const schools = [{ id: "101", name: "High School" }];
```

### 3. Define Types (`schema/UserType.js`)

We use objects instead of strings. This allows strict references.
_Notice `fields: () => ({...})`? That arrow function fixes "Circular Dependency" issues (e.g. User needs School, School needs User)._

```javascript
import { GraphQLObjectType, GraphQLString, GraphQLID } from "graphql";
import { SchoolType } from "./SchoolType.js"; // Import relation
import { schools } from "../db.js";

export const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    school: {
      type: SchoolType,
      resolve(parent) {
        return schools.find((s) => s.id === parent.schoolId);
      },
    },
  }),
});
```

### 4. Define Queries (`schema/RootQuery.js`)

This is the entry point for Reading data.

```javascript
import { GraphQLObjectType, GraphQLList, GraphQLID } from "graphql";
import { UserType } from "./UserType.js";
import { users } from "../db.js";

export const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return users;
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return users.find((u) => u.id === args.id);
      },
    },
  },
});
```

### 5. Define Mutations (`schema/RootMutation.js`)

This is for Creating/Updating/Deleting.

```javascript
import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from "graphql";
import { UserType } from "./UserType.js";
import { users } from "../db.js";

export const RootMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: { username: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(parent, args) {
        const newUser = { id: Date.now().toString(), username: args.username };
        users.push(newUser);
        return newUser;
      },
    },
  },
});
```

### 6. Assemble Schema (`schema.js`)

```javascript
import { GraphQLSchema } from "graphql";
import { RootQuery } from "./schema/RootQuery.js";
import { RootMutation } from "./schema/RootMutation.js";

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
```

### 7. Launch Server (`index.js`)

```javascript
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "./schema.js";

const server = new ApolloServer({ schema }); // <--- Using 'schema', not typeDefs

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`🚀 Scalable Server ready at: ${url}`);
```

---

## 🎓 Recommended Tools

1.  **Apollo Server**: The industry standard for Node.js.
2.  **Apollo Sandbox**: The interface at `localhost:4000` to test queries.
3.  **Postman**: Also supports GraphQL now!
