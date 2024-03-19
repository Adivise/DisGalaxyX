const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    config: {
        name: "move",
        description: "Move position song in queue!",
        usage: "<3 1>",
        category: "Music",
        accessableby: "Member"
    },
    run: async (client, message) => {
        const msg = await message.channel.send("Processing.....");

        const queue = client.distube.getQueue(message);
        if (!queue) return msg.edit(`There is nothing in the queue right now!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return msg.edit("You need to be in a same/voice channel.")

        const tracks = args[0];
        const position = args[1];

        if (isNaN(tracks) || isNaN(position)) return msg.edit(`Please enter a valid number in the queue! ${client.prefix}move <from> <to>`);


        if (tracks == 0) return msg.edit(`Cannot move a song already playing.`);
        if (position == 0) return msg.edit(`Cannot move to this position a song already playing.`);
        if (tracks > queue.songs.length) return msg.edit(`Queue | Song not found.`);
        if (position > queue.songs.length) return msg.edit(`Position | Song not found.`);

        const song = queue.songs[tracks];

        await queue.songs.splice(tracks);
        await queue.addToQueue(song, position);

        const embed = new EmbedBuilder()
            .setDescription(`**Moved • [${song.name}](${song.url})** to ${position}`)
            .setColor(client.color)

        msg.edit({ embeds: [embed] });
    }
}