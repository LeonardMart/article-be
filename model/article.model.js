const config = require("../config/db.config");
const Sequelize = config.Sequelize;
const sequelize = config.sequelize;

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

function table_posts() {
  const Table = sequelize.define(
    "posts",
    {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement:true,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(200),
        unique: true,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING(100),
        unique: true,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: "Publish, Draft, Trash",
      },
    },
    {
      underscored: true,
      createAt: true,
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
      tableName: "posts",
    }
  );

  return Table;
}

db.posts = table_posts();

module.exports = db;
