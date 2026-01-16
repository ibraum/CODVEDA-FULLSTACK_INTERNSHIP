import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './graphql/typeDefs/index.js';
import { resolvers } from './graphql/resolvers/index.js';
import { getUserFromToken } from './utils/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 },
  context: async ({ req }) => {
    const token = req.headers.authorization || '';
    const user = getUserFromToken(token);
    return { user };
  },
});

console.log(`🚀  Server ready at: ${url}`);
console.log(`graphQl playground at: ${url}`);
