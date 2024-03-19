const { EmbedBuilder } = require("discord.js");

module.exports = async (client, queue, playlist) => {
    const embed = new EmbedBuilder()
        .setDescription(`**Queued • [${playlist.name}](${playlist.url})** \`${queue.formattedDuration}\` (${playlist.songs.length} tracks) • ${playlist.user}`)
        .setColor(client.color)
  
      queue.textChannel.send({ embeds: [embed] })
}