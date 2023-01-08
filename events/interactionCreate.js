const { Events, Collection } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');
let emitter = require('../eventEmitter');

const menuPath = path.join(__dirname,'menus');
const menuFiles = fs.readdirSync(menuPath).filter(file => file.endsWith('.js'));

let menus = new Collection();

for(const file of menuFiles){
	const filePath = path.join(menuPath,file);
	const menu = require(filePath);
	menus.set(menu.customId, menu);
}

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		if(interaction.isAnySelectMenu()){
			await menus.get(interaction.customId).execute(interaction);
			emitter.emit(interaction.customId);
		}
	
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	},
};
