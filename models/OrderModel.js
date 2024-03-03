const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize("mysql://root:radharamanlal@localhost:3306/EcommerceDB");
const User = require('./models/UserModel');

const Order = sequelize.define('Order', {
    order_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    order_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Order.belongsTo(User, {
    foreignKey: 'user_id'
});


(async() => {
    try {
        await sequelize.sync();
        console.log('Order table created successfully!');
    } catch (error) {
        console.error('Error creating Order table:', error);
    }
})();