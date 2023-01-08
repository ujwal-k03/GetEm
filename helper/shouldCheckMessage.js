const {hasChannelPerms} = require('./channelPerms');

module.exports = {
    async shouldCheck(message, guildData){
        
        let toReturn = false;
        // If the message is created in a non-filtered channel, return false
        if(!guildData.filteredChannels.includes(message.channelId)){
            return false;   
        }

        // If the message is sent by someone whose role is exempted, return false
        guildData.modRoles.forEach(roleId=>{
            if(message.member?.roles.cache.has(roleId)){
                toReturn = true;
                return;
            }
        })

        return !toReturn;
    }
}