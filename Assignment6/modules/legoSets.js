require('dotenv').config();
const Sequelize = require('sequelize');

// Set up sequelize to point to our postgres database
const sequelize = new Sequelize('SenecaDB', 'SenecaDB_owner', 'kGqau8Z5yUsp', {
  host: 'ep-late-cell-a5mesw6x-pooler.us-east-2.aws.neon.tech',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  }
});

// Theme model
const Theme = sequelize.define(
  'Theme',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true, // Use "id" as a primary key
      autoIncrement: true, // Automatically increment the value
    },
    name: Sequelize.STRING,
  },
  {
    createdAt: false, // Disable createdAt
    updatedAt: false, // Disable updatedAt
  }
);

// Set model
const Set = sequelize.define(
  'Set',
  {
    set_num: {
      type: Sequelize.STRING,
      primaryKey: true, // Use "set_num" as a primary key
    },
    name: Sequelize.STRING,
    year: Sequelize.INTEGER,
    num_parts: Sequelize.INTEGER,
    theme_id: Sequelize.INTEGER,
    img_url: Sequelize.STRING
  },
  {
    createdAt: false, // Disable createdAt
    updatedAt: false, // Disable updatedAt
  }
);

Set.belongsTo(Theme, { foreignKey: 'theme_id' });

async function initialize() { 
  try {
    await sequelize.sync();
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getAllSets() {
  try {
    const sets = await Set.findAll({ include: [Theme] });
    return sets;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getAllThemes() {
  try {
    const themes = await Theme.findAll();
    return themes;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getSetByNum(setNum) {
  try {
    const foundSet = await Set.findAll({
      include: [Theme],
      where: { set_num: setNum }
    });
    if (foundSet.length > 0) {
      return foundSet[0];
    } else {
      throw new Error("Unable to find requested set");
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getSetsByTheme(theme) {
  try {
    const foundSets = await Set.findAll({
      include: [Theme],
      where: { 
        '$Theme.name$': {
          [Sequelize.Op.iLike]: `%${theme}%`
        }
      }
    });
    if (foundSets.length > 0) {
      return foundSets;
    } else {
      throw new Error("Unable to find requested sets");
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function addSet(setData) {
  try {
    await Set.create(setData);
  } catch (err) {
    throw new Error(err.errors[0].message);
  }
}

async function editSet(set_num, setData) {
  try {
    await Set.update(setData, { where: { set_num: set_num } });
  } catch (err) {
    throw new Error(err.errors[0].message);
  }
}

async function deleteSet(set_num) {
  try {
    await Set.destroy({ where: { set_num: set_num } });
  } catch (err) {
    throw new Error(err.errors[0].message);
  }
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme, getAllThemes, addSet, editSet, deleteSet };
