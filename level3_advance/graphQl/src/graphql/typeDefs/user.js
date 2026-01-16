export const userTypeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    password: String
    tasks: [Task]
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`;
