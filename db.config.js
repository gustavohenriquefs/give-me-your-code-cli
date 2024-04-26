import { Sequelize } from 'sequelize'
import Template from './schema/template.js'
import { File } from './schema/file.js'

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite',
    logging: false
})
 
const db = {}

db.sequelize = sequelize
db.Sequelize = Sequelize

db.Template = Template({ sequelize, Sequelize })
db.File = File({ sequelize, Sequelize })

export { db }