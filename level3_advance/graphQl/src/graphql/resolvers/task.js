import { tasks, users } from '../../config/data.js';

export const taskResolvers = {
  Query: {
    tasks: (_, { limit = 10, offset = 0 }, context) => {
      if (!context.user) throw new Error('Unauthorized');
      const userTasks = tasks.filter(t => t.userId === context.user.id);
      return userTasks.slice(offset, offset + limit);
    },
    task: (_, { id }, context) => {
      if (!context.user) throw new Error('Unauthorized');
      return tasks.find(t => t.id === id && t.userId === context.user.id);
    }
  },
  Mutation: {
    createTask: (_, { title, description }, context) => {
      if (!context.user) throw new Error('Unauthorized');
      
      const newTask = {
        id: String(tasks.length + 1),
        title,
        description,
        completed: false,
        userId: context.user.id
      };
      
      tasks.push(newTask);
      return newTask;
    },
    updateTask: (_, { id, title, description, completed }, context) => {
      if (!context.user) throw new Error('Unauthorized');
      
      const task = tasks.find(t => t.id === id && t.userId === context.user.id);
      if (!task) throw new Error('Task not found');

      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (completed !== undefined) task.completed = completed;
      
      return task;
    },
    deleteTask: (_, { id }, context) => {
      if (!context.user) throw new Error('Unauthorized');

      const index = tasks.findIndex(t => t.id === id && t.userId === context.user.id);
      if (index === -1) throw new Error('Task not found');
      
      tasks.splice(index, 1);
      return `Task ${id} deleted successfully`;
    }
  },
  Task: {
    user: (parent, _, { loaders }) => loaders.userLoader.load(parent.userId)
  }
};
