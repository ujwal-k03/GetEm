const { Events } = require('discord.js');
const GuildData = require('../models/guildsData');

// Load the bot's client id to exempt it from checks
require('dotenv').config();
const BOT_ID = process.env.CLIENT_ID;

async function kickMember(member, violatedRegex){
    const reason = `Another one bites the dust, *got 'em!* (Severity Level : **${violatedRegex.severity}**)`;
    await member.kick(reason);
}

async function warnMember(member, channel ,violatedRegex){
    await channel.send(member.toString()+` ***[Warning]*** you have violated the spam filter!`);
}

module.exports = {
    name: Events.MessageCreate,
    async execute(message){

        // If message from bot or message outside a guild, return
        if(!message.inGuild() || message.author.id===BOT_ID){
            return;
        }
        
        console.log(message.content, message.author.tag);

        const guildId = message.guildId;
        const guildData = await GuildData.findOne({guildId}).exec();

        console.log(message.member.roles.cache);
        console.log(guildData.modRole);
        
        if(message.member.roles.cache.hasAny(guildData.modRole)){
            console.log('Dis dude a mod');
            return;
        }

        let violatedRegex = undefined;
        guildData.regexArray.forEach((regexEntry)=>{
            if(RegExp(regexEntry.regex).test(message.content)){
                if(!violatedRegex){
                    violatedRegex = regexEntry;
                }
                else{
                    if(regexEntry.severity > violatedRegex.severity)
                        violatedRegex = regexEntry;
                }
            }
        });

        if(violatedRegex){
            const guildMember = message.member;
            const channel = message.channel;
            message.delete();
            switch(violatedRegex.severity){
                case 1 : break;
                case 2 : warnMember(guildMember, channel, violatedRegex); break;
                case 3 : kickMember(guildMember, violatedRegex); break;
            }
        }
    }   
}