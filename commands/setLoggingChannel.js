const { SlashCommandBuilder, ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType } = require('discord.js');
const GuildsData = require('../models/guildsData');
let eventEmitter = require('../eventEmitter');

const CUSTOM_ID = 'log-channel-menu';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logging-channel')
        .setDescription('Configure the channel for the bot to log its actions')
        .addSubcommand(subcommand => 
            subcommand.setName('set')
                .setDescription('Set the logging channel'))
        .addSubcommand(subcommand => 
            subcommand.setName('disable')
                .setDescription('Disable logging')),
    async execute(interaction){

        // If the subcommand is to disable logging
        if(interaction.options.getSubcommand() === 'disable'){

            try{
                await GuildsData.updateOne(
                    {guildId: interaction.guildId},
                    {loggingEnabled: false}
                )
    
                await interaction.reply({
                    content: '✅ Logging disabled successfully!',
                    ephemeral: true
                })
            } catch(err){
                console.log(err);
                await interaction.reply({
                    content: '❌ Something went wrong while disabling logging',
                    ephemeral: true
                })
            }

            return;
        }
        
        // If the subcommand is to set the logging channel
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