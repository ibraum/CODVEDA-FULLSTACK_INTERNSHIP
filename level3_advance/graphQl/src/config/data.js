import bcrypt from 'bcryptjs';

const hashPassword = (password) => bcrypt.hashSync(password, 10);

export const users = [
  { 
    id: "1", 
    email: "admin@graphql.com", 
    password: hashPassword("admin123") 
  },
  { 
    id: "2", 
    email: "user@graphql.com", 
    password: hashPassword("user123") 
  }
];

export const tasks = [
  { 
    id: "1", 
    title: "Setup GraphQL Server", 
    description: "Install Apollo Server and configure Node.js", 
    completed: true, 
    userId: "1" 
  },
  { 
    id: "2", 
    title: "Learn Mutations", 
    description: "Understand how to modify data", 
    completed: false, 
    userId: "1" 
  },
  { 
    id: "3", 
    title: "Build Frontend", 
    description: "Connect React to GraphQL", 
    completed: false, 
    userId: "2" 
  }
];
