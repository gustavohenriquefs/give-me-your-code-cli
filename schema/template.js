const Template = (db) => db.sequelize.define('templates', {
    id: {
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: db.Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    description: {
        type: db.Sequelize.STRING,
        allowNull: false
    }
})
 
export { Template }