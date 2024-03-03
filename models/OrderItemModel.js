const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize("mysql://root:radharamanlal@localhost:3306/EcommerceDB");
const User = require('./models/UserModel');
const Product = require('./models/ProductModel')
const Orderitem = sequelize.define('Order Item', {
    order_item__id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    unitprice: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

Orderitem.belongsTo(Order, {
    foreignKey: 'order_id'
});
Orderitem.belongsTo(Product, {
    foreignKey: 'product_id'
});
(async() => {
    try {
        await sequelize.sync();
        console.log('Order Item table created successfully!');
    } catch (error) {
        console.error('Error creating Order Item table:', error);
    }
})();