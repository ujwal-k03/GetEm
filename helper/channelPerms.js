const {PermissionsBitField} = require('discord.js');

const reqPerms = [
    PermissionsBitField.Flags.ViewChannel,
    PermissionsBitField.Flags.ManageMessages,
    PermissionsBitField.Flags.ReadMessageHistory,
    PermissionsBitField.Flags.SendMessages,
]

module.exports = {
    hasChannelPerms(channel, guildMember){
        return channel.permissionsFor(guildMember).has(reqPerms);
    }
}