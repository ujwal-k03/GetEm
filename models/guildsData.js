const mongoose = require('mongoose');

const guildsDataSchema = new mongoose.Schema({
    guildId: String,
    modRoles: [String],
    loggingEnabled: {type: Boolean, default: false},
    loggingChannel: String,
    filteredChannels: [String],
    regexArray: [{regex: String, severity: Number}],
})

const GuildData = mongoose.model('GuildData', guildsDataSchema);
module.exports = GuildData;