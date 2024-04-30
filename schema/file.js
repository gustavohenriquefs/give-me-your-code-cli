const File = (db) => db.sequelize.define('files', {
  id: {
    type: db.Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: db.Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: db.Sequelize.STRING,
    allowNull: false,
  }
})

export { File }
