const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const GuildData = require('../models/guildsData');

const boilerplateEmbed = new EmbedBuilder()
    .setColor('Red')
    .setTitle('List of Regexs')
    .setDescription('The list of available regex strings in the server')
    .setTimestamp()
    .setFooter({text : "Beep boop I'm a bot"});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list-regex')
        .setDescription('List the regex strings for the current server'),
    async execute(interaction){
        const guildData = await GuildData.findOne({guildId : interaction.guildId});
        let listEmbed = boilerplateEmbed;

        // Create the embed string to be displayed
        let valueString = "```Id\tSeverity\tRegex``````"  ;
        guildData.regexArray.forEach((obj, index)=>{
            let idx = `${index}`.padEnd(6,' ');
            let sev = `${obj.severity}`.padStart(4,' ').padEnd(13,' ')
            valueString += `${idx}${sev}${obj.regex}\n`;
        })
        valueString += "```";

        // Add the embed field and the footer
        listEmbed.addFields({name : 'List', value: valueString});

        // Send it away
        interaction.reply({embeds : [boilerplateEmbed], ephemeral : true});
    }
}