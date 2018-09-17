const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

var unirest = require('unirest');

client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {

	if (!message.content.startsWith(config.prefix)) return;

	const args = message.content.slice(config.prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
	    client.commands.get(command).execute(message, args);
	}
	catch (error) {
	    console.error(error);
	    message.reply('There was an error trying to execute that command!');
	}
});

client.login(process.env.discord_token);