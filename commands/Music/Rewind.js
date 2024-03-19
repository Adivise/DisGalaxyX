const { EmbedBuilder } = require('discord.js');

module.exports = {
    config: {
        name: "rewind",
        description: "Rewind timestamp in the song!",
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

        if (!args[0]) {
            if((queue.currentTime - 10) > 0) {

                await queue.seek(queue.currentTime - 10);
                
                const embed = new EmbedBuilder()
                    .setDescription(`\`⏮\` | *Rewind to:* \`${queue.formattedCurrentTime}\``)
                    .setColor(client.color);

                msg.edit({ content: ' ', embeds: [embed] });

            } else {
                msg.edit(`Cannot rewind beyond the song's duration.`);
            }
        } else if ((queue.currentTime - args[0]) > 0) {

            await queue.seek(queue.currentTime - args[0]);
            
            const embed = new EmbedBuilder()
                .setDescription(`\`⏮\` | *Rewind to:* \`${queue.formattedCurrentTime}\``)
                .setColor(client.color);

            msg.edit({ content: ' ', embeds: [embed] });

        } else { 
            msg.edit(`Cannot rewind beyond the song's duration.`);
        }
    }
}