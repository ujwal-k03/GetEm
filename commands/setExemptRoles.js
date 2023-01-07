const { SlashCommandBuilder, RoleSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-exempt-roles')
        .setDescription('Set the roles which are to be excluded from spam filtering'),
    async execute(interaction){
        const row = new ActionRowBuilder()
            .addComponents(
                new RoleSelectMenuBuilder()
                    .setCustomId('role-menu')
                    .setPlaceholder('Select roles')
                    .setMaxValues(25)
                    .setMinValues(0)
            )
        
        await interaction.reply({
            content: 'Choose the roles to be exempted',
            components: [row],
            ephemeral: true
        })
    }
}