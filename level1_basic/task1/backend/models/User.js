import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  firstname: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'First name is required'
      },
      len: {
        args: [2, 50],
        msg: 'First name must be between 2 and 50 characters'
      },
      is: {
        args: /^[a-zA-Z\s'-]+$/,
        msg: 'First name can only contain letters, spaces, hyphens, and apostrophes'
      }
    },
    set(value) {
      this.setDataValue('firstname', value.trim());
    }
  },
  lastname: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Last name is required'
      },
      len: {
        args: [2, 50],
        msg: 'Last name must be between 2 and 50 characters'
      },
      is: {
        args: /^[a-zA-Z\s'-]+$/,
        msg: 'Last name can only contain letters, spaces, hyphens, and apostrophes'
      }
    },
    set(value) {
      this.setDataValue('lastname', value.trim());
    }
  },
  username: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Username is required'
      },
      len: {
        args: [3, 30],
        msg: 'Username must be between 3 and 30 characters'
      },
      is: {
        args: /^[a-zA-Z0-9_]+$/,
        msg: 'Username can only contain letters, numbers, and underscores'
      }
    },
    set(value) {
      this.setDataValue('username', value.toLowerCase().trim());
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Email is required'
      },
      isEmail: {
        msg: 'Please provide a valid email address'
      },
      len: {
        args: [5, 100],
        msg: 'Email must be between 5 and 100 characters'
      }
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase().trim());
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Password is required'
      },
      len: {
        args: [8, 255],
        msg: 'Password must be at least 8 characters long'
      }
    }
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Age is required'
      },
      isInt: {
        msg: 'Age must be a whole number'
      },
      min: {
        args: [13],
        msg: 'Age must be at least 13'
      },
      max: {
        args: [120],
        msg: 'Age cannot exceed 120'
      }
    }
  },
  field: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Field/Profession is required'
      },
      len: {
        args: [2, 100],
        msg: 'Field must be between 2 and 100 characters'
      }
    },
    set(value) {
      this.setDataValue('field', value.trim());
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user',
    validate: {
      isIn: {
        args: [['user', 'admin']],
        msg: 'Role must be either user or admin'
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  loginAttempts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Login attempts cannot be negative'
      },
      max: {
        args: [5],
        msg: 'Maximum login attempts reached'
      }
    }
  },
  lockedUntil: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      unique: true,
      fields: ['username']
    },
    {
      fields: ['role']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['created_at']
    }
  ],
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const bcrypt = await import('bcrypt');
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const bcrypt = await import('bcrypt');
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeValidate: (user) => {
      if (user.firstname) user.firstname = user.firstname.trim();
      if (user.lastname) user.lastname = user.lastname.trim();
      if (user.username) user.username = user.username.toLowerCase().trim();
      if (user.email) user.email = user.email.toLowerCase().trim();
      if (user.field) user.field = user.field.trim();
    }
  }
});

User.prototype.comparePassword = async function(candidatePassword) {
  const bcrypt = await import('bcrypt');
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.isLocked = function() {
  return !!(this.lockedUntil && this.lockedUntil > Date.now());
};

User.prototype.incrementLoginAttempts = async function() {
  if (this.lockedUntil && this.lockedUntil < Date.now()) {
    return await this.update({
      loginAttempts: 1,
      lockedUntil: null
    });
  }

  const updates = { loginAttempts: this.loginAttempts + 1 };
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.lockedUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
  }

  return await this.update(updates);
};

User.prototype.resetLoginAttempts = async function() {
  return await this.update({
    loginAttempts: 0,
    lockedUntil: null,
    lastLogin: new Date()
  });
};

export default User;