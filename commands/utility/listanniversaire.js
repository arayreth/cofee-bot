const { SlashCommandBuilder, InteractionResponse, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, Embed} = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('listanniversaire')
		.setDescription('Obtenez la liste des anniversaire !'),
	async execute(interaction) {
        const rawData = fs.readFileSync('birthday.json');
            const birthdays = JSON.parse(rawData);

            const em_list_birthday = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle("__Liste des anniversaires__")
            .setDescription("Voila la liste des anniversaire des membres du serveur !")
            .setTimestamp()
            .setFooter({ text: 'Fait par Rayreth avec 💖', iconURL: 'https://cdn.discordapp.com/icons/1040645618311385158/577f596043d0ea6a4cc91859cebfcf11.webp?size=160'});         
            for (const [userId, timestamp] of Object.entries(birthdays)) {
                const currentYear = new Date().getUTCFullYear();
                const birthdayDate = new Date(timestamp * 1000); // Convert to JavaScript Date from Unix
                const birthYear = birthdayDate.getUTCFullYear();
                const month = birthdayDate.getUTCMonth(); // Get birthday month (0-11)
                const day = birthdayDate.getUTCDate(); // Get birthday day (1-31)
    
                // Create a date for the birthday this year
                let thisYearBirthday = new Date(Date.UTC(currentYear, month, day));
    
                // If the birthday has already passed this year, calculate for next year
                if (thisYearBirthday < new Date()) {
                    thisYearBirthday.setUTCFullYear(currentYear + 1);
                }
                let age = currentYear - birthYear;
                 if (thisYearBirthday.getUTCFullYear() > currentYear) {
                age += 1;
                }
    
                // Convert the new birthday timestamp for this year
                const thisYearTimestamp = Math.floor(thisYearBirthday.getTime() / 1000);
    
                em_list_birthday.addFields(
                { name: `Bg/Blg:`, value: `<@${userId}>`, inline: true},
                { name: `Date d'Anniversaire:`, value: `<t:${timestamp}:d> ${age} ans <t:${thisYearTimestamp}:R>`},
                );
              }  
            interaction.reply({ embeds: [em_list_birthday] });
    }
}