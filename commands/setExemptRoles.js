const { SlashCommandBuilder, RoleSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
let eventEmitter = require('../eventEmitter');

const CUSTOM_ID = 'role-menu';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-exempt-roles')
        .setDescription('Set the roles which are to be excluded from spam filtering'),
    async execute(interaction){
        const row = new ActionRowBuilder()
            .addComponents(
                new RoleSelectMenuBuilder()
                    .setCustomId(CUSTOM_ID)
                    .setPlaceholder('Select roles')
                    .setMaxValues(25)
                    .setMinValues(0)
            )
        
        await interaction.reply({
            content: 'Choose the roles to be exempted',
            components: [row],
            ephemeral: true
        })

        eventEmitter.once(CUSTOM_ID, async ()=>{
            await interaction.deleteReply();
        })
    }
}