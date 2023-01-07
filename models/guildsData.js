const mongoose = require('mongoose');

const guildsDataSchema = new mongoose.Schema({
    guildId: String,
    regexArray: [{regex: String, severity: Number}],
    modList: [String]
})

const GuildData = mongoose.model('GuildData', guildsDataSchema);
module.exports = GuildData;