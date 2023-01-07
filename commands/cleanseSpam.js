const { SlashCommandBuilder } = require('discord.js');
const GuildData = require('../models/guildsData');
const { checkMsg } = require('../helper/checkMessage');

async function isPastDay(date, yesterday){
    return date.getDate() >= yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear();
}

async function CleanseChannel(channel, regexArray){
    // set the value of yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let toReturn = false;

    // Fetch the first message and use it as pointer
    let message = await channel.messages
            .fetch({ limit: 1 })
            .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));

    // Iterate through the messages using pagination
    while(message){
        await channel.messages
            .fetch({ limit: 100, before: message.id })
            .then(messagePage => {
                // Iterate through all the messages in the page
                messagePage.forEach(message => {
                    // If message is older than yesterday, stop
                    if(!isPastDay(message.createdAt,yesterday)){
                        toReturn = true;
                        return;
                    }

                    console.log(message.content);

                    // Else check the message and dish out punishment
                    checkMsg(message,regexArray);
                });
                
                // Update our message pointer to be last message in page of messages
                message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
            })
        if(toReturn)
            return;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cleanse-spam')
        .setDescription('Delete spam from the past day that has escaped the watchful eye of the bot'),
    async execute(interaction){
        const guildId = interaction.guildId;
        const guild = interaction.guild;
        const guildData = await GuildData.findOne({guildId}).exec();

        const filteredChannels = (await GuildData.findOne({guildId},'filteredChannels').exec()).filteredChannels;
        

        filteredChannels.forEach(id=>{
            CleanseChannel(guild.channels.cache.get(id), guildData.regexArray);
        })

    }
}