module.exports = async (client) => {
    require("./Player/loadDistube.js")(client);
    require("./Player/loadContent.js")(client);
    require("./Player/loadSetup.js")(client);
    require("./Player/loadUpdate.js")(client);
};