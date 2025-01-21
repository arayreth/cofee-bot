const { SlashCommandBuilder, InteractionResponse, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder} = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rentrealamaison')
		.setDescription('Rentrez chez vous !!!'),
	async execute(interaction) {
                interaction.reply(`<@1031224185382506646> <@948298731948740640> te demande de rentrer à la maison !`);
    }
}