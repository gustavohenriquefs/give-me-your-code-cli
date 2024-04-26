const File = (db) => db.sequelize.define("file", {
  id: {
    type: db.Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  templateId: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    foreignKey: true,
    references: {
      model: "template",
      key: "id",
    },
  },
  name: {
    type: db.Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: db.Sequelize.STRING,
    allowNull: false,
  },
});

export { File }