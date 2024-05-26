module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
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

  return User;
};