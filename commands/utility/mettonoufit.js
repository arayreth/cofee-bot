const { SlashCommandBuilder, InteractionResponse, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder} = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mettonoufit')
		.setDescription('METS LE !!!'),
	async execute(interaction) {
                interaction.reply(`<@1031224185382506646> Mets ton outfit ici fais pas ta Claire !`);
    }
}