const { SlashCommandBuilder, InteractionResponse, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder} = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rappel')
		.setDescription('Obtenez la liste de vos rappel !'),
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

            const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('__Vos rappel__')
            .setDescription("Voici la liste de vos rappel !")
            .setTimestamp()
            .setFooter({ text: 'Fait par Rayreth avec 💖', iconURL: 'https://cdn.discordapp.com/icons/1040645618311385158/577f596043d0ea6a4cc91859cebfcf11.webp?size=160'});
            
    
            userReminders.forEach((reminder, index) => {
            embed.addFields({
            name: `Rappel numéro ${index + 1}`,
            value: `**Titre:** ${reminder.title}\n**Description:** ${reminder.description}\n**Date limite:** <t:${reminder.timestamp}:D> <t:${reminder.timestamp}:R>`,
            });
            })
            interaction.reply({ embeds: [embed] });     
    }
}