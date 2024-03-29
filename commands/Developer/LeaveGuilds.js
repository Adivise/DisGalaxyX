const { EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");

module.exports = {
    config: {
        name: "leaveguild",
        category: "Developer",
        description: "Let the bot leave all guilds!",
        accessableby: "Owner"
    },
    run: async (client, message, args) => {
        if(message.author.id != client.owner) return message.channel.send("You not the client the owner!");

        const db = new Database(`./settings/models/access.json`, { databaseInObject: true });
        
        const database = db.get(`whitelist`);
        const guild = message.client.guilds.cache;
        // check if bot not in whitelist = leave
        const LeaveStr = [];
        guild.forEach(async (guild) => {
            if (!database.includes(guild.id)) {
                LeaveStr.push(`**Leave • ${guild.name} (${guild.id})**`);
                await guild.leave();
            }
        });

        const str = LeaveStr.join("\n");
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: "Leave Server", iconURL: client.user.displayAvatarURL() })
            .setDescription(`${str == '' ? 'Nothing' : '' + str}`);

        message.channel.send({ embeds: [embed] });
    }
}