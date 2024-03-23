const { Client, EmbedBuilder, AttachmentBuilder, PermissionsBitField, GatewayIntentBits } = require("discord.js");
const { Database } = require("st.db");

const GSetup = new Database("./settings/models/setup.json", { databaseInObject: true });
const { TOKEN, PREFIX } = require("../../settings/config.json");

module.exports = {
    config: {
        name: "setup",
        aliases: [],
        usage: "(forum id)",
        category: "Miscellaneous",
        description: "Create a song sender channel",
        accessableby: "Members"
    },
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.channel.send(`You don't have permission.`);

        const string = args[0]
        if (!string) return message.channel.send("Please give me **Forum Channel ID**")

        const channel = await client.channels.cache.get(string);
        
        if (channel.type != 15) return message.channel.send("Please use **Forum Channel**.")
    
        for (let i = 0; i < TOKEN.length ; i++) {
            const bot = new Client({
                intents: [
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.GuildMembers,
                    GatewayIntentBits.GuildMessages,
                    GatewayIntentBits.GuildVoiceStates,
                    GatewayIntentBits.MessageContent,
                ],
            });

            bot.createExSetup = async function (message, forum, msg, thread) {
                const db = new Database("./settings/models/setup.json", { databaseInObject: true });
                await db.set(`${message.guild.id}_${bot.user.id}`, {
                    setup_enable: true,
                    guild_id: message.guild.id,
                    bot_id: bot.user.id,
                    setup_msg: msg,
                    setup_ch: forum,
                    setup_td: thread
                });
            }

            bot.prefix = PREFIX[i];
            if (!bot.token) bot.token = TOKEN[i];

            bot.on("ready", async (msg) => {
                // auto create request channel!!!!
                const forum = bot.channels.cache.get(string);
                const guild = bot.guilds.cache.get(forum.guild.id)

                const db = await GSetup.get(`${guild.id}_${bot.user.id}`);
                if (db.setup_enable === true) return;

                const attachment = new AttachmentBuilder("./settings/images/banner.png", { name: "setup.png" });

                await forum.threads.create({
                    name: bot.user.username,
                    message: {
                        content: "Play Song Right Here!!!!"
                    },
                    files: [attachment],
                    appliedTags: []
                }).then(async (thread) => {

                    const content = `**__Queue list:__**\nJoin a voice channel and queue songs by name or url in here.`;

                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setAuthor({ name: `No song playing currently.` })
                        .setImage(`https://images2.alphacoders.com/110/thumb-1920-1109233.jpg`)
                        .setDescription(`>>> [Invite](https://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=2184310032&scope=bot%20applications.commands) | [Support](https://discord.gg/SNG3dh3MbR) | [Website](https://adivise.github.io/Stylish/)`)
                        .setFooter({ text: `Prefix is: ${bot.prefix}` });

                    // SEND BANNER FIRST!
                    await thread.send({ files: [attachment] });
                    await thread.send({ content: `${content}`, embeds: [embed], components: [client.diSwitch, client.diSwitch2] }).then(async (message) => {
                        // Create database!
                        await bot.createExSetup(message, forum.id, message.id, thread.id); // Can find on handlers/loadDatabase.js
                    })
                });
            })

            bot.login(bot.token);
        }   

        return message.channel.send(`Success Creating Music System\n**ALL COMMAND ARE DISABLED, Please delete forum first to use commands. (i lazy to code this one sorry!)**`);
    }
}