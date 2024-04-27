const File = (db) => db.sequelize.define('files', {
  id: {
    type: db.Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  templateId: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'templates',
      key: 'id',
      onDelete: 'CASCADE'
    }
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
