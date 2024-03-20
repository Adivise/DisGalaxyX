const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const ytsr = require("@distube/ytsr");

module.exports = {
    config: {
        name: "searchtop",
        description: "Search and queue song to the top.",
        usage: "<result>",
        category: "Music",
        accessableby: "Member",
    },
    run: async (client, message, args) => {

        const { channel } = message.member.voice;
        if (!channel) return message.channel.send("You need to be in voice channel.")
        if (!channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.Connect)) return message.channel.send(`I don't have perm \`CONNECT\` in ${channel.name} to join voice!`);
        if (!channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.Speak)) return message.channel.send(`I don't have perm \`SPEAK\` in ${channel.name} to join voice!`);
        
        // list channel who in voice channel
        const list = await message.member.guild.channels.fetch(channel.id);
        const members = list.members.map(m => m);
        const bot = members.filter(m => m.user.bot === true).map(m => m.user.id);
        // Can't have 2 bot in 1 voice channel
        if (!bot.includes(client.user.id)) {
            if (bot.length === 1) return message.channel.send(`You can't use 2 bot in 1 voice channel!`);
        }

        const row = new  ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("one")
            .setEmoji("1️⃣")
            .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("two")
            .setEmoji("2️⃣")
            .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("three")
            .setEmoji("3️⃣")
            .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("four")
            .setEmoji("4️⃣")
            .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("five")
            .setEmoji("5️⃣")
            .setStyle(ButtonStyle.Secondary)
        )

        const string = args.join(" ");
        if (!string) {
            return message.channel.send("Please provide a song name or link.");
        }

        const options = {
            member: message.member,
            textChannel: message.channel,
            message,
            position: 1
        }

        const res = await ytsr(string, { safeSearch: true, limit: 5 });

        let index = 1;
        const result = res.items.slice(0, 5).map(x => `**(${index++}.) [${x.name}](${x.url})** Uploader: \`${x.x.author.name}\``).join("\n")

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Song Selection...`, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setColor(client.color)
            .setDescription(result)
            .setFooter({ text: `Please response in 30s` })

        const msg = await message.channel.send({ content: ' ', embeds: [embed], components: [row] });

        const collector = message.channel.createMessageComponentCollector({ filter: (m) => m.user.id === message.author.id, time: 30000, max: 1 });

        collector.on('collect', async (message) => {
            const id = message.customId;

            if(id === "one") {
                await msg.delete();
                await client.distube.play(message.member.voice.channel, res.items[0].url, options);
            } else if(id === "two") {
                await msg.delete();
                await client.distube.play(message.member.voice.channel, res.items[1].url, options);
            } else if(id === "three") {
                await msg.delete();
                await client.distube.play(message.member.voice.channel, res.items[2].url, options);
            } else if(id === "four") {
                await msg.delete();
                await client.distube.play(message.member.voice.channel, res.items[3].url, options);
            } else if(id === "five") {
                await msg.delete();
                await client.distube.play(message.member.voice.channel, res.items[4].url, options);
            }
        });

        collector.on('end', async (collected, reason) => {
            if(reason === "time") {
                msg.edit({ content: `No Response`, embeds: [], components: [] });
            }
        });
    }
}