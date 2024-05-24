module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define("users", {
    uid: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING
    },
    first_name: {
      type: Sequelize.STRING
    },
    last_name: {
      type: Sequelize.STRING
    },
    dob: {
      type: Sequelize.STRING
    },
    profile_pic_url: {
      type: Sequelize.STRING
    }
  });

  return Users;
};