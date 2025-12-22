import sequelize from '../config/database.js';
import User from './User.js';

const models = {
  User,
  sequelize,
  Sequelize: sequelize.Sequelize
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export default models;