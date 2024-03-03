const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize("mysql://root:radharamanlal@localhost:3306/EcommerceDB");
const Product = sequelize.define('Product', {
    product_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    productname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productdesc: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productprice: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantityavail: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

(async() => {
    try {
        await sequelize.sync();
        console.log('product table created successfully!');
    } catch (error) {
        console.error('Error creating Product table:', error);
    }
})();