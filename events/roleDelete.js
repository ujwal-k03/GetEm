const { Events } = require("discord.js");
const GuildData = require("../models/guildsData");

module.exports = {
    name: Events.GuildRoleDelete,
    async execute(role) {
        const guildId = role.guild.id;
        const roleId = role.id;

        // Update the mod roles
        await GuildData.updateOne(
            {guildId},
            {$pull : {modRoles : roleId}}
        );
        
    }
}