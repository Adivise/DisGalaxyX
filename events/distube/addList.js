const { EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");

const GSetup = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = async (client, queue, playlist) => {
  await client.UpdateMusic(queue);

  const db = await GSetup.get(`${queue.textChannel.guild.id}_${client.user.id}`);
	if (db.setup_enable === true) return;

    const embed = new EmbedBuilder()
        .setDescription(`**Queued • [${playlist.name}](${playlist.url})** \`${queue.formattedDuration}\` (${playlist.songs.length} tracks) • ${playlist.user}`)
        .setColor(client.color)
  
      queue.textChannel.send({ embeds: [embed] })
}