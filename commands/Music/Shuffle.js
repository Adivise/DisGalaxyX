const { EmbedBuilder } = require('discord.js');

module.exports = { 
    config: {
        name: "shuffle",
        aliases: ["mix"],
        description: "Shuffles the current queue.",
        accessableby: "Member",
        category: "Music",
    },
    run: async (client, message, args) => {
        const msg = await message.channel.send("Processing.....");

        const queue = client.distube.getQueue(message);
        if (!queue) msg.edit(`There is nothing in the queue right now!`)
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return msg.edit("You need to be in a same/voice channel.")

        await client.distube.shuffle(message);

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`\`🔀\` | **Song has been:** \`Shuffle\``);

        msg.edit({ content: ' ', embeds: [embed] });
    }
};