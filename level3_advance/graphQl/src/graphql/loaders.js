import DataLoader from 'dataloader';
import { users, tasks } from '../config/data.js';

const batchUsers = async (userIds) => {
  return userIds.map(id => users.find(u => u.id === id));
};

const batchTasksByUser = async (userIds) => {
  const tasksFound = tasks.filter(t => userIds.includes(t.userId));
  
  const groupedTasks = {};
  tasksFound.forEach(task => {
    if (!groupedTasks[task.userId]) {
      groupedTasks[task.userId] = [];
    }
    groupedTasks[task.userId].push(task);
  });

  return userIds.map(id => groupedTasks[id] || []);
};

export const createLoaders = () => ({
  userLoader: new DataLoader(batchUsers),
  tasksByUserIdLoader: new DataLoader(batchTasksByUser)
});
