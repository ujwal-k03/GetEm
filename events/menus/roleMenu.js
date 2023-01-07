const GuildsData = require('../../models/guildsData');

module.exports = {
    customId: 'role-menu',
    async execute(interaction){
        try{
            await GuildsData.updateOne(
                {guildId: interaction.guildId},
                {modRoles: interaction.values}
            )

            await interaction.reply({
                content: 'Exempted roles updated successfully!',
                ephemeral: true
            })
        } catch (err) {
            console.log(err);
            await interaction.reply({
                content: 'Something went wrong while updating the roles',
                ephemeral: true
            })
        }
    }
    
}