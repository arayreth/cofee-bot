const { SlashCommandBuilder, InteractionResponse, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder} = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Obtenir le ping du bot'),
	async execute(interaction) {
                interaction.reply({content: `🏓 Pong ${interaction.client.ws.ping} ms !`});
    }
}