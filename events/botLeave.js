const { Events } = require('discord.js');
const GuildData = require('../models/guildsData');

module.exports = {
    name: Events.GuildDelete,
    async execute(guild) {
        const guildData = await GuildData.findOneAndRemove({guildId : guild.id}).exec();
    }
}