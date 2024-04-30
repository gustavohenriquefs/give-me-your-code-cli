import { Sequelize } from 'sequelize';
import { Template } from './schema/template.js';
import { File } from './schema/file.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(__dirname, './db.sqlite'),
    logging: false
});

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Template = Template({ sequelize, Sequelize });
db.File = File({ sequelize, Sequelize });

db.Template.hasMany(db.File, 
    { as: 'files', foreignKey: 'templateId' }
)

db.File.belongsTo(db.Template)

export { db }