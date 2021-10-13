const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// creates user model
class User extends Model {
    //set up method to run on instance data (per user) to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

//define table columns and config
User.init(
    {
        //define an id column
        id: {
            //use the special sequelize datatypes object to provide what type of data it is
            type: DataTypes.INTEGER,
            //this is the equivalent of SQL's NOT NULL
            allowNull: false,
            //instruct that this is the primary key
            primaryKey: true,
            //turn on auto-increment
            autoIncrement: true
        },
        //define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            //there cannot be duplicate email values in this table
            unique: true,
            //if allowNull is set to false, we can run data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        //define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                //this means the password must be at least 4 characters long
                len: [4]
            }
        }
    },
    {
        //table config options go here ((https://sequelize.org/v5/manual/models-definition.html#configuration))
        hooks : {
            //set up beforeCreate lifecycle "hook" functionality
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
                },
            
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        //pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        //dont automatically create createdAt / updatedAt timestamp fields
        timestamps: false,
        //dont pluralize name of database table
        freezeTableName: true,
        //use underscores instead of camel-casing
        underscored: true,
        //make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;