import { Sequelize } from 'sequelize'
import Template from './schema/templates.js'
import { File } from './schema/files.js'

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './templates.sqlite'
})
 
const db = {}

db.sequelize = sequelize
db.Sequelize = Sequelize

db.Template = Template({ sequelize, Sequelize })
db.File = File({ sequelize, Sequelize })

db.sequelize.sync().then()

export { db }