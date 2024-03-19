const { EmbedBuilder } = require("discord.js");

module.exports = { 
    config: {
        name: "remove",
        description: "Remove song from queue!",
        usage: "<number>",
        category: "Music",
        accessableby: "Member",
        aliases: ["rt", "rs"],
    },
    run: async (client, message, args) => {
        const msg = await message.channel.send(`Loading please wait....`);
        
        const queue = client.distube.getQueue(message);
        if (!queue) return msg.edit(`There is nothing in the queue right now!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return msg.edit("You need to be in a same/voice channel.")

        if (isNaN(args[0])) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`Please enter a valid number!`);

            return msg.edit({ content: ' ', embeds: [embed] });
        }

        if (args[0] == 0) return msg.edit(`Cannot remove a song already playing.`);
        if (args[0] > queue.songs.length) return msg.edit(`Song not found.`);

        const song = queue.songs[args[0]];

        await queue.songs.splice(args[0], 1);

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`**Removed • [${song.name}](${song.url})** \`${song.formattedDuration}\` • ${song.user}`)

        msg.edit({ content: ' ', embeds: [embed] });
    }
}