const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removerappel')
        .setDescription('Permet de supprimer un rappel.')
        .addNumberOption(option =>
            option
                .setName('id')
                .setDescription('L\'id du rappel à supprimer.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const id = interaction.options.getNumber('id');
        let reminders = []; // Initialize reminders here
        
        if (fs.existsSync("./reminders.json")) {
            const data = fs.readFileSync("./reminders.json");
            reminders = JSON.parse(data);
        }
        
        // Find the reminder by ID
        const reminder = reminders.find(reminder => reminder.id === id);
        
        if (reminder) {
            // Check if the user ID matches
            if (reminder.discordId === interaction.user.id) {
                // Remove the reminder from the array
                reminders = reminders.filter(rem => rem.id !== id);
        
                // Save the updated reminders back to the file
                fs.writeFileSync("./reminders.json", JSON.stringify(reminders, null, 2));
        
                interaction.reply({ content: `<:cofeerd:1284232054296281249> Le rappel avec l'ID ${id} a été supprimé avec succès.`, ephemeral: true });
            } else {
                interaction.reply({ content: `<:cofeerd:1284232054296281249> Vous ne pouvez pas supprimer ce rappel car il ne vous appartient pas !`, ephemeral: true });
            }
        } else {
            interaction.reply({ content: `<:cofeeComputer:1287000487316557847> Aucun rappel n'a été trouvé avec l'ID ${id}.`, ephemeral: true });
        }
        
    }
};
