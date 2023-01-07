const {SlashCommandBuilder} = require('discord.js');
const GuildData = require('../models/guildsData');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-regex')
        .setDescription('Delete a regex entry with the specified id')
        .addIntegerOption(option =>
            option.setName('id')
                .setDescription('The id of the regex entry you want removed')
                .setRequired(true)
        ),
    async execute(interaction){
        let guildId = interaction.guildId;
        let regexid = interaction.options.getInteger('id');

        let guildData = await GuildData.findOne({guildId : guildId}).exec();

        if(regexid >= guildData.regexArray.length){ // If the regex id is invalid
            await interaction.reply({
                content: `Enter a valid regex id (0-${guildData.regexArray.length - 1})`,
                ephemeral: true
            });
        }
        else{ // If we find a valid regex
            const regexEntry = guildData.regexArray[regexid];
            try{
                await GuildData.updateOne(
                    { guildId : guildId },
                    { $pull: {regexArray : regexEntry}},
                )
                await interaction.reply({
                    content: `✅ \`${regexEntry.regex}\` deleted succesfully!`,
                    ephemeral: true
                });
            }
            catch(e){
                await interaction.reply({
                    content: '❌ Something went wrong while deleting...',
                    ephemeral: true
                });
                console.log(e);
            }
        }
    }
}