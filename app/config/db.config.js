module.exports = {
    HOST: "localhost",
    USER: "woomigoroot",
    PASSWORD: "1234567811",
    DB: "woomigodb",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };