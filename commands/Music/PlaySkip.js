const { PermissionsBitField } = require("discord.js");

module.exports = {
    config: {
        name: "playskip",
        description: "Play and skip to the song!",
        accessableby: "Member",
        category: "Music",
        aliases: ["pskip", "skipplay"]
    },
    run: async (client, message, args) => {
        
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send("You need to be in voice channel.")
        if (!message.guild.members.cache.get(client.user.id).permissionsIn(channel).has(PermissionsBitField.Flags.Connect)) return message.channel.send(`I don't have perm \`CONNECT\` in ${channel.name} to join voice!`);
        if (!message.guild.members.cache.get(client.user.id).permissionsIn(channel).has(PermissionsBitField.Flags.Speak)) return message.channel.send(`I don't have perm \`SPEAK\` in ${channel.name} to join voice!`);

		// list channel who in voice channel
        const list = await message.member.guild.channels.fetch(channel.id);
        const members = list.members.map(m => m);
        const bot = members.filter(m => m.user.bot === true).map(m => m.user.id);
        // Can't have 2 bot in 1 voice channel
        if (!bot.includes(client.user.id)) {
            if (bot.length === 1) return message.channel.send(`You can't use 2 bot in 1 voice channel!`);
        }
		
        const string = args.join(" ");
        if (!string) {
            return message.channel.send("Please provide a song name or link.");
        }

        const options = {
            member: message.member,
            textChannel: message.channel,
            message,
            skip: true
        }

        await client.distube.play(message.member.voice.channel, string, options);
    }
};
