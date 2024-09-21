const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rappel')
        .setDescription('Obtenez la liste de vos rappels !'),
    async execute(interaction) {
        const remindersFilePath = path.join(__dirname, '../../reminders.json');
        let reminders = [];
        
        if (fs.existsSync(remindersFilePath)) {
            const data = fs.readFileSync(remindersFilePath);
            reminders = JSON.parse(data);
        }
        
        const userReminders = reminders.filter(reminder => reminder.discordId === interaction.user.id);

        if (userReminders.length === 0) {
            return interaction.reply(`<:cofeerd:1284232054296281249> Vous n'avez pas de rappel !`);
        }

        // Sort reminders by timestamp (earliest first)
        userReminders.sort((a, b) => a.timestamp - b.timestamp);

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('__Vos rappels__')
            .setDescription("Voici la liste de vos rappels !")
            .setTimestamp()
            .setFooter({ text: 'Fait par Rayreth avec 💖', iconURL: 'https://cdn.discordapp.com/icons/1040645618311385158/577f596043d0ea6a4cc91859cebfcf11.webp?size=160' });

        userReminders.forEach((reminder, index) => {
            embed.addFields({
                name: `Rappel numéro ${index + 1}`,
                value: `**ID**: ${reminder.id}\n**Titre**: ${reminder.title}\n**Description**: ${reminder.description}\n**Date limite**: <t:${reminder.timestamp}:D> <t:${reminder.timestamp}:R>`,
            });

            // Add a separator after each reminder except the last one
            if (index < userReminders.length - 1) {
                embed.addFields({ name: '\u200b', value: '──────────' }); // Separator line
            }
        });

        interaction.reply({ embeds: [embed] });     
    }
};