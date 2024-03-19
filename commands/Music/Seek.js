const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    config: {
        name: "seek",
        description: "Seek timestamp in the song!",
        accessableby: "Member",
        category: "Music",
        usage: "<seconds>"
    },
    run: async (client, message, args) => {
        const msg = await message.channel.send("Processing.....");
        
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

        if(args[0] >= queue.songs[0].duration || args[0] < 0) return msg.edit(`Cannot seek beyond length of song.`);

        await queue.seek(args[0]);

        const embed = new EmbedBuilder()
            .setDescription(`\`⏭\` | *Seeked to:* \`${args[0]}\``)
            .setColor(client.color);

        msg.edit({ content: ' ', embeds: [embed] });
    }
}