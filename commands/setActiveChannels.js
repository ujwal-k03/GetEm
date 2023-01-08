const { SlashCommandBuilder, ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType } = require('discord.js');
let eventEmitter = require('../eventEmitter');

const CUSTOM_ID = 'channel-menu';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-active-channels')
        .setDescription('Set the channels for the bot to filter in'),
    async execute(interaction){
        const row = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId(CUSTOM_ID)
                    .setPlaceholder('Selecting something')
                    .setChannelTypes([
                        ChannelType.DM,
                        ChannelType.GuildText,
                        ChannelType.GuildVoice
                    ])
                    .setMinValues(0)
                    .setMaxValues(25)
            )
        
        await interaction.reply({
            content: 'Choose the channels to be filtered',
            components: [row],
            ephemeral: true
        })

        eventEmitter.once(CUSTOM_ID, async ()=>{
            await interaction.deleteReply();
        })
    }
}