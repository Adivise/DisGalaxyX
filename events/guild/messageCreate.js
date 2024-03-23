const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");

const GSetup = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = async (client, message) => { 
    if(message.author.bot || message.channel.type === "dm") return;

    await client.createExSetup(message);

    // check enable
    const data = await GSetup.get(`${message.guild.id}_${client.user.id}`);
    if (data.setup_enable === true) return;

    const PREFIX = client.prefix;

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(mention)) {
      const embed = new EmbedBuilder()
        .setColor("#000001")
        .setDescription(`**My prefix is: \`${PREFIX}\`**`);
      message.channel.send({ embeds: [embed] })
    };
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [ matchedPrefix ] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if(!command) return;

    // dev
    if (!client.dev.includes(message.author.id) && client.dev.length > 0) { 
      message.channel.send(`${message.author}, You are not a developer!`);
      console.log(`[WARN] - ${message.author.tag} trying request the command from ${message.guild.name} (Not a developer)`); 
      return;
    }
	
	  // whitelist
	  const db = new Database(`./settings/models/access.json`, { databaseInObject: true });
    const database = await db.get("whitelist");
    if (!database.includes(message.guild.id) && database.length > 0) {
      message.channel.send(`${message.author}, Your need a whitelist server to use commands.`);
      console.log(`[WARN] - ${message.author.tag} trying request the command from ${message.guild.name} (Not Whitelisted)`);
      return;
    }
    
    if(!message.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return await message.author.dmChannel.send({ content: `I don't have perm  **\`SEND_MESSAGES\`** permission in <#${message.channelId}> to execute command!` }).catch(() => {});
    if(!message.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return await message.channel.send({ content: `I don't have perm **\`EMBED_LINKS\`** to execute command!` }).catch(() => {});
    
    console.log(`[COMMAND] ${command.config.name} executed by ${message.author.tag} | [${client.user.tag}] in ${message.guild.name} (${message.guild.id})`);

    try {
        command.run(client, message, args);
    } catch (error) {
        console.log(error);
        const embed = new EmbedBuilder()
            .setColor("#000001")
            .setDescription("There was an error executing that command.");

        return message.channel.send({ embeds: [embed] });
    }
}