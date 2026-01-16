import { userTypeDefs } from './user.js';
import { taskTypeDefs } from './task.js';

export const typeDefs = `#graphql
  ${userTypeDefs}
  ${taskTypeDefs}

  type Query {
    users(limit: Int, offset: Int): [User]
    user(id: ID!): User
    tasks(limit: Int, offset: Int): [Task]
    task(id: ID!): Task
  }

  type Mutation {
    register(email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    
    createTask(title: String!, description: String): Task
    updateTask(id: ID!, title: String, description: String, completed: Boolean): Task
    deleteTask(id: ID!): String
  }
`;
