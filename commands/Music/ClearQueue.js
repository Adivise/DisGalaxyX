const { EmbedBuilder } = require('discord.js');

module.exports = { 
    config: {
        name: "clear",
        description: "Clear song in queue!",
        accessableby: "Member",
        category: "Music",
    },
    run: async (client, message, args) => {
        const msg = await message.channel.send(`Loading please wait....`);

        const queue = client.distube.getQueue(message);
        if (!queue) msg.edit(`There is nothing in the queue right now!`)
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return msg.edit("You need to be in a same/voice channel.")

        await queue.songs.splice(1, queue.songs.length);
        
        const embed = new EmbedBuilder()
            .setDescription("`📛` | *Queue has been:* `Cleared`")
            .setColor(client.color);

        msg.edit({ content: ' ', embeds: [embed] });
    }
}