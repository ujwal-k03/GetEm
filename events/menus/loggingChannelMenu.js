const GuildsData = require('../../models/guildsData');

module.exports = {
    customId: 'log-channel-menu',
    async execute(interaction){

        try{
            await GuildsData.updateOne(
                {guildId: interaction.guildId},
                {loggingEnabled: true, loggingChannel: interaction.values[0]}
            )

            await interaction.reply({
                content: '✅ Logging channel updated successfully!',
                ephemeral: true
            })
        } catch (err) {
            console.log(err);
            await interaction.reply({
                content: '❌ Something went wrong while updating the logging channel',
                ephemeral: true
            })
        }
    }
    
}