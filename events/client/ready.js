module.exports = async (client) => {
	console.log(`Logged in as ${client.user.tag}!`);

	client.user.setPresence({ 
		activities: [{ name: `Made by: stylish.`, type: 2 }], 
		status: 'online', 
	});
}
