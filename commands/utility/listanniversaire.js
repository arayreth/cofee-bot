const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listanniversaire')
        .setDescription('Obtenez la liste des anniversaires !'),
    async execute(interaction) {
        const rawData = fs.readFileSync('birthday.json');
        const birthdays = JSON.parse(rawData);

        const birthdayList = [];
        const currentYear = new Date().getUTCFullYear();

        for (const [userId, timestamp] of Object.entries(birthdays)) {
            const birthdayDate = new Date(timestamp * 1000);
            const birthYear = birthdayDate.getUTCFullYear();
            const month = birthdayDate.getUTCMonth();
            const day = birthdayDate.getUTCDate();

            let thisYearBirthday = new Date(Date.UTC(currentYear, month, day));

            if (thisYearBirthday < new Date()) {
                thisYearBirthday.setUTCFullYear(currentYear + 1);
            }
            let age = currentYear - birthYear;
            if (thisYearBirthday.getUTCFullYear() > currentYear) {
                age += 1;
            }

            const thisYearTimestamp = Math.floor(thisYearBirthday.getTime() / 1000);
            
            birthdayList.push({ userId, thisYearTimestamp, age });
        }

        // Sort the birthdays by the upcoming date
        birthdayList.sort((a, b) => a.thisYearTimestamp - b.thisYearTimestamp);

        const em_list_birthday = new EmbedBuilder()
            .setColor("bca370")
            .setTitle("__Liste des anniversaires__")
            .setDescription("Voici la liste des anniversaires des membres du serveur !")
            .setTimestamp()
            .setFooter({ text: 'Fait par Rayreth avec 💖', iconURL: 'https://cdn.discordapp.com/icons/1040645618311385158/577f596043d0ea6a4cc91859cebfcf11.webp?size=160' });

        birthdayList.forEach((birthday, index) => {
            em_list_birthday.addFields(
                { name: `Bg/Blg:`, value: `<@${birthday.userId}>`, inline: true },
                { name: `Date d'Anniversaire:`, value: `<t:${birthdays[birthday.userId]}:d> ${birthday.age} ans <t:${birthday.thisYearTimestamp}:R>` },
            );
        });

        interaction.reply({ embeds: [em_list_birthday] });
    }
};
