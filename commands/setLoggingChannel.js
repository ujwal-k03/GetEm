const { SlashCommandBuilder, ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType } = require('discord.js');
let eventEmitter = require('../eventEmitter');

const CUSTOM_ID = 'log-channel-menu';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-logging-channel')
        .setDescription('Set the channel for the blog to log its actions'),
    async execute(interaction){
        const row = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId(CUSTOM_ID)
                    .setPlaceholder('Select a channel')
                    .setChannelTypes([
                        ChannelType.DM,
                        ChannelType.GuildText,
                        ChannelType.GuildVoice
                    ])
            )
        
        await interaction.reply({
            content: 'Choose the logging channel',
            components: [row],
            ephemeral: true
        })
        
        eventEmitter.once(CUSTOM_ID, async ()=>{
            await interaction.deleteReply();
        })
        
    }
}