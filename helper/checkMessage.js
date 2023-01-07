const {shouldCheck} = require('./shouldCheckMessage');

async function kickMember(member, violatedRegex){
    if(!member.kickable)
        return;
    const reason = `Another one bites the dust, *got 'em!* (Severity Level : **${violatedRegex.severity}**)`;
    await member.kick(reason);
}

async function warnMember(member, channel ,violatedRegex){
    await channel.send(member.toString()+` ***[Warning]*** you have violated the spam filter!`);
}

module.exports = {
    async checkMsg(message, guildData){

        const regexArray = guildData.regexArray;
        
        // If the message is whitelisted in any way, return
        if(! await shouldCheck(message, guildData)){
            return;
        }

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
            await message.delete();
            switch(violatedRegex.severity){
                case 1 : break;
                case 2 : warnMember(guildMember, channel, violatedRegex); break;
                case 3 : kickMember(guildMember, violatedRegex); break;
            }
        }

    }    
}