const { SlashCommandBuilder } = require('discord.js');
const GuildData = require('../models/guildsData');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-regex')
        .setDescription('Add a regex check')
        .addIntegerOption(option => 
            option.setName('severity')
                .setDescription('The severity level (1-3) of the regex')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(3)
        )
        .addStringOption( option =>
            option.setName('regex-string')
                .setDescription('The RegEx string')
                .setRequired(true)
        ),
    async execute(interaction){
        let regex = interaction.options.getString('regex-string');
        let severity = interaction.options.getInteger('severity');
        let guildId = interaction.guildId;

        // Update the document by pushing the regex onto the array
        await GuildData.updateOne(
            { guildId : guildId },
            { $push: {regexArray : {regex, severity}}},
        )
        
        // Interaction response
        await interaction.reply({
            content: `✅ Added regex \`${regex}\` with a severity of **${severity}**`,
            ephemeral: true
        });
    }
}