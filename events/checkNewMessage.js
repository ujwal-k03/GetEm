const { Events } = require('discord.js');
const GuildData = require('../models/guildsData');
const { checkMsg } = require('../helper/checkMessage');

// Load the bot's client id to exempt it from checks
require('dotenv').config();
const BOT_ID = process.env.CLIENT_ID;

module.exports = {
    name: Events.MessageCreate,
    async execute(message){

        // If message from bot or message outside a guild, return
        if(!message.inGuild() || message.author.id===BOT_ID){
            return;
        }

        const guildId = message.guildId;
        const guildData = await GuildData.findOne({guildId}).exec();
        
        if(message.member.roles.cache.hasAny(guildData.modRole)){
            console.log('Dis dude a mod');
            return;
        }

        await checkMsg(message,guildData);
        
    }   
}