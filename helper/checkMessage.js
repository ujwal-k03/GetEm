const {shouldCheck} = require('./shouldCheckMessage');

async function kickMember(member, loggingEnabled, loggingChannel){
    if(!member.kickable)
        return;
    const reason = `*Got 'em!*`;
    await member.kick(reason);

    if(!loggingEnabled)
        return;
    
        let msgContent = `🥾 **Kicked** user ${member.toString()} for the above violation`;
    
        await loggingChannel.send({
            content: msgContent
        })
}

async function warnMember(member, channel, loggingEnabled, loggingChannel){
    await channel.send('⚠️ **[Warning]** ' + member.toString() + ' has violated the spam filter!');

    if(!loggingEnabled)
        return;
    
    let msgContent = `⚠️ **Warned** user ${member.toString()} for the above violation`;
    
    await loggingChannel.send({
        content: msgContent
    })
}

async function delMessage(member, message, loggingEnabled, loggingChannel, violatedRegex){
    await message.delete();

    if(!loggingEnabled)
        return;
    
    let msgContent = "";
    msgContent += `❌ **Deleted** message by ${member.toString()} on ${message.createdAt.toString()}\n`;
    msgContent += `**Channel:** ${message.channel.toString()}\n`;
    msgContent += `**Regex violated:** \`${violatedRegex.regex}\`**[${violatedRegex.severity}]**\n`
    msgContent += '**Message Content:**\n';
    msgContent += `>>> ${message.content}`;
    
    await loggingChannel.send({
        content: msgContent
    })
    
}

module.exports = {
    async checkMsg(message, guildData){

        const regexArray = guildData.regexArray;
        const loggingEnabled = guildData.loggingEnabled;
        const loggingChannel = loggingEnabled ? message.guild.channels.cache.get(guildData.loggingChannel) : undefined;



        // If the message is whitelisted in any way, return
        if(! await shouldCheck(message, guildData))
            return;

        // Define the most severe regex that is violated
        let violatedRegex = undefined;

        // Iterate through all the regex entries
        regexArray.forEach((regexEntry)=>{
            if(RegExp(regexEntry.regex).test(message.content)){
                if(!violatedRegex){ // If violatedRegex not set, set it
                    violatedRegex = regexEntry;
                }
                else{ // Update violatedRegex if it is more severe
                    if(regexEntry.severity > violatedRegex.severity)
                        violatedRegex = regexEntry;
                }
            }
        });

        // Punish according to the severity
        if(violatedRegex){
            const guildMember = message.member;
            const channel = message.channel;
            await delMessage(guildMember, message, loggingEnabled, loggingChannel, violatedRegex);
            switch(violatedRegex.severity){
                case 1 : break;
                case 2 : warnMember(guildMember, channel, loggingEnabled, loggingChannel); break;
                case 3 : kickMember(guildMember, loggingEnabled, loggingChannel); break;
            }
        }

    }    
}