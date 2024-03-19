const { EmbedBuilder } = require("discord.js");

module.exports = async (client, queue) => {
    const embed = new EmbedBuilder()
    .setColor(client.color)
    .setDescription(`**Channel is Empty!**`)

    queue.textChannel.send({ embeds: [embed] })
}