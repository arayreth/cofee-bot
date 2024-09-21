const { SlashCommandBuilder, InteractionResponse, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder} = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Permet de faire dire du texte au bot !')
        .addStringOption(option =>
			option
				.setName('texte')
				.setDescription('Le texte que vous voulez faire dire au bot !')
                .setRequired(true)),
	async execute(interaction) {
        const text = interaction.options.getString('texte')
        await interaction.channel.send(text)
        await interaction.reply({content: "<:cofeerd:1284232054296281249> La commande à été effectué avec succées !", ephemeral: true })
    }
}