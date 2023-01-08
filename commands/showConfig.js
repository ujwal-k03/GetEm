const { SlashCommandBuilder, EmbedBuilder, Guild } = require('discord.js');
const GuildData = require('../models/guildsData');

const boilerplateEmbed = new EmbedBuilder()
    .setColor('Red')
    .setTimestamp()
    .setFooter({text : "Beep boop I'm a bot"});

function loggingEmbed(listEmbed, guildData, guild){
    const channel = guild.channels.cache.get(guildData.loggingChannel);
    listEmbed
        .setTitle('Logging Channel')
        .setDescription(channel.toString());
};

function exemptRoleEmbed(listEmbed, guildData, guild){
    let roles = "";
    guildData.modRoles.forEach(roleId => {
        roles += guild.roles.cache.get(roleId).toString();
        roles += '\n';
    });
    
    listEmbed
        .setTitle('Exempted Roles')
        .setDescription(roles)
};

function activeChannelEmbed(listEmbed, guildData, guild){
    let channels = "";
    guildData.filteredChannels.forEach(channelId => {
        channels += guild.channels.cache.get(channelId).toString();
        channels += '\n';
    });
    
    listEmbed
        .setTitle('Active Channels')
        .setDescription(channels)
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('show-config')
        .setDescription('Show the current configuration of the bot')
        .addSubcommand(subcommand => 
            subcommand.setName('logging')
                .setDescription('Display the logging configuration'))
        .addSubcommand(subcommand => 
            subcommand.setName('exempt-roles')
                .setDescription('Display the list of exempt roles'))
        .addSubcommand(subcommand =>
            subcommand.setName('active-channels')
                .setDescription('Display the list of channels that the bot filters')),
    async execute(interaction){
        
        let listEmbed = new EmbedBuilder(boilerplateEmbed);
        const guildData = await GuildData.findOne({guildId: interaction.guildId}).exec();
        const guild = interaction.guild;

        switch(interaction.options.getSubcommand()){
            case 'logging' : loggingEmbed(listEmbed, guildData, guild); break;
            case 'exempt-roles' : exemptRoleEmbed(listEmbed, guildData, guild); break;
            case 'active-channels' : activeChannelEmbed(listEmbed, guildData, guild); break;
        };

        await interaction.reply({
            embeds: [listEmbed],
            ephemeral: true
        });

    }
}