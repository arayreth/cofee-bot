const { SlashCommandBuilder, InteractionResponse, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder} = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vadormir')
		.setDescription('Allez dormir !!!'),
	async execute(interaction) {
                interaction.reply(`<@927450521302863942> et <@477869784932024321> Aller dormir or consequences <:cofeeBan:1286735536794501142> !`);
    }
}