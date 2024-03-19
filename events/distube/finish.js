const { EmbedBuilder } = require("discord.js");

module.exports = async (client, queue) => {
    const embed = new EmbedBuilder()
        .setDescription(`\`📛\` | **Song has been:** \`Ended\``)
        .setColor(client.color)

    queue.textChannel.send({ embeds: [embed] })
}