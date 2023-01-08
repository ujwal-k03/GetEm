const { SlashCommandBuilder } = require('discord.js');
const GuildData = require('../models/guildsData');
const { checkMsg } = require('../helper/checkMessage');
const { hasChannelPerms } = require('../helper/channelPerms');

const ONEHOUR = 60*60*1000;

function isWithinTimeframe(date, pastTime){
    return date.getTime() >= pastTime.getTime()
}

async function cleanseChannel(channel, guildData, hours, guildMember){

    // If the channel doesn't have permissions, return false
    if(!hasChannelPerms(channel,guildMember)){
        return false;
    }

    // After this point, there are permissions and always return true
    // Set the value of yesterday
    const pastTime = new Date();
    pastTime.setTime(pastTime.getTime() - hours*ONEHOUR);

    let toReturn = false;

    // Fetch the first message and use it as pointer
    let message = await channel.messages
            .fetch({ limit: 1 })
            .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));

    // Check the first message seperately
    if(message && isWithinTimeframe(message.createdAt, pastTime))
        checkMsg(message, guildData);

    // Iterate through the messages using pagination
    while(message){
        await channel.messages
            .fetch({ limit: 100, before: message.id })
            .then(messagePage => {
                // Iterate through all the messages in the page
                messagePage.forEach(message => {
                    // If message is older than yesterday, stop
                    if(!isWithinTimeframe(message.createdAt,pastTime)){
                        toReturn = true;
                        return;
                    }

                    // Else check the message and dish out punishment
                    checkMsg(message, guildData);
                });
                
                // Update our message pointer to be last message in page of messages
                message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
            })
        if(toReturn)
            return true;
    }

    return true;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-spam')
        .setDescription("Delete spam from the 'X' hours that has escaped the watchful eye of the bot")
        .addIntegerOption(option => 
            option.setName('hours')
                .setDescription("The 'X' hours to delete spam from")
                .setMinValue(1)
                .setMaxValue(48)
                .setRequired(true)
        ),
    async execute(interaction){
        const guildId = interaction.guildId;
        const guild = interaction.guild;
        const guildMember = guild.members.me;
        const guildData = await GuildData.findOne({guildId}).exec();
        const hours = interaction.options.getInteger('hours');

        const filteredChannels = guildData.filteredChannels;
        let noPermChannels = "";
        await interaction.deferReply({ephemeral: true});

        for await (const id of filteredChannels){
            const channel = guild.channels.cache.get(id);
            if(! await cleanseChannel(channel, guildData, hours, guildMember)){
                noPermChannels += '\t\t';
                noPermChannels += channel.toString();
                noPermChannels += '\n';
            }  
        }

        try{
            if(noPermChannels === ""){
                await interaction.editReply({
                    content: '✅ **Spam removed successfully!**'
                })
            }
            else {
                await interaction.editReply({
                    content: '⚠️ **[Warning]** Channels:\n\n' 
                            + noPermChannels 
                            + '\nhave insuffient permssions, they have been skipped during filtering'
                })
            }
        } catch(err){
            await interaction.editReply({
                content: 'Something went wrong while responding, your command might have been executed'
            })
        }

    }
}