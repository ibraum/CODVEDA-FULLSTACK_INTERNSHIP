import { userResolvers } from './user.js';
import { taskResolvers } from './task.js';

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...taskResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...taskResolvers.Mutation
  },
  User: userResolvers.User,
  Task: taskResolvers.Task
};
