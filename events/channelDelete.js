const { Events } = require("discord.js");
const GuildData = require("../models/guildsData");

module.exports = {
    name: Events.ChannelDelete,
    async execute(channel) {
        const guildId = channel.guildId;
        const channelId = channel.id;
        const guildData = await GuildData.findOne({guildId}).exec();
        // Update the filtered channels
        await GuildData.updateOne(
            {guildId},
            {$pull : {filteredChannels : channelId}}
        );
        
        // Update the logging situation
        if(guildData.loggingChannel === channelId){
            await GuildData.updateOne(
                {guildId},
                {loggingEnabled: false, loggingChannel: ""}
            );
        }
        
    }
}