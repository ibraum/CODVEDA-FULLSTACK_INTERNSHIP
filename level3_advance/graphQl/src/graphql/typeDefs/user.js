export const userTypeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    password: String
    tasks(limit: Int, offset: Int): [Task]
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`;
