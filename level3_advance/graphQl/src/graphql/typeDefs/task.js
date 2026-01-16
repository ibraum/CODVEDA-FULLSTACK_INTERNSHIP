export const taskTypeDefs = `#graphql
  type Task {
    id: ID!
    title: String!
    description: String
    completed: Boolean!
    user: User
  }
`;
