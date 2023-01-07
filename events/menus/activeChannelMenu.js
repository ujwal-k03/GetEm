const GuildsData = require('../../models/guildsData');

module.exports = {
    customId: 'channel-menu',
    async execute(interaction){
        try{
            await GuildsData.updateOne(
                {guildId: interaction.guildId},
                {filteredChannels: interaction.values}
            )

            await interaction.reply({
                content: '✅ Active channels updated successfully!',
                ephemeral: true
            })
        } catch (err) {
            console.log(err);
            await interaction.reply({
                content: '❌ Something went wrong while updating the channels',
                ephemeral: true
            })
        }
    }
    
}