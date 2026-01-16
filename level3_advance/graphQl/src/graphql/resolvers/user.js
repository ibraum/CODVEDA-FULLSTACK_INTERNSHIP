import { users, tasks } from '../../config/data.js';
import { generateToken } from '../../utils/auth.js';
import bcrypt from 'bcryptjs';

export const userResolvers = {
  Query: {
    users: () => users,
    user: (_, { id }) => users.find(u => u.id === id)
  },
  Mutation: {
    register: async (_, { email, password }) => {
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: String(users.length + 1),
        email,
        password: hashedPassword
      };
      
      users.push(newUser);
      
      const token = generateToken(newUser);
      return { token, user: newUser };
    },
    login: async (_, { email, password }) => {
      const user = users.find(u => u.email === email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Invalid credentials');
      }

      const token = generateToken(user);
      return { token, user };
    }
  },
  User: {
    tasks: (parent) => tasks.filter(t => t.userId === parent.id)
  }
};
