'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Tutor, {through: models.Tutors_Students, foreignKey:'student_id'})
    }
  }
  Student.init({
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    isSuspended: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Student',
  });
  return Student;
};