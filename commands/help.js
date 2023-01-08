const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const GuildData = require("../models/guildsData");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Send Help'),
    async execute(interaction){

        // For first time use
        // Check if the document exists for the guild 
        if(!(await GuildData.exists({guildId : interaction.guildId}))){
            console.log(`No document found for guild [${interaction.guildId}], creating one...`);
            await GuildData.create({guildId : interaction.guildId});
        }

        const genInfo = "First of all, dont worry about deleting active channels, the logging channel, \
        or any of the exempt roles, this is taken care of and you wont get an error. However once you delete \
        something, make sure you verify the config using the `show-config` to make sure you still have it configured \
        properly. Happy hunting.";
        const helpInfo = "Make sure to first use the help command upon joining the server to \
        register your guild to the database. Guess that step is already complete now.";
        const pingHelp = "Use this to check bot connectivity.";
        const listRegexHelp = "This command lists all the regexs, their ids and severities.";
        const addRegexHelp = "Use this command to add new regexs. Keep in mind that there are 3 levels \
        of severity (1-3).";
        const deleteRegexHelp = "This command deletes the regex with the specified id (which you obtain from \
        the `list-regex` command.";
        const removeSpamHelp = "This command removes all the escaped spam from the past `X` hours. \
        It obeys the same rules as normal filtering (same filtered channels, exempt roles and regexs).";
        const setActiveChannelHelp = "This is a set command, not a add command. Whatever you select become the new \
        list of active (filtered) channels.";
        const setExemptRolesHelp = "This command sets the exempt roles. Same as above, this is a set command, not an add \
        command. Use this to preferably exempt the bot (Otherwise be prepared for some nasty infinite loops).";
        const setLoggingHelp = "Use the subcommands to either set a logging channel or disable logging altogether.";
        const showConfigHelp = "Use the subcommands to see the current config of the active(filtered) channels, \
        exempt roles, and logging.";

        let helpEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('GetEm help')
            .setDescription('Here\'s some help bucko')
            .setTimestamp()
            .setFooter({text: "Beep boop I'm a bot"})
            .addFields(
                {name: 'General Information', value: genInfo},
                {name: 'help', value: helpInfo },
                {name: 'ping', value: pingHelp},
                {name: 'list-regex', value: listRegexHelp},
                {name: 'add-regex', value: addRegexHelp},
                {name: 'delete-regex', value: deleteRegexHelp},
                {name: 'remove-spam', value: removeSpamHelp},
                {name: 'set-active-channels', value: setActiveChannelHelp},
                {name: 'set-exempt-roles', value: setExemptRolesHelp},
                {name: 'logging-channel', value: setLoggingHelp},
                {name: 'show-config', value: showConfigHelp},
            )

        await interaction.reply({
            embeds: [helpEmbed],
            ephemeral: true
        });
    }
}