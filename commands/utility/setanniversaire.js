const { error } = require('console');
const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setanniversaire')
		.setDescription('Définisez la date de votre anniversaire.'),
	async execute(interaction) {
		const m_anniversaire = new ModalBuilder()
		.setCustomId('anniversaire')
		.setTitle('Définisez votre anniversaire')

		const i_birthday = new TextInputBuilder()
		.setCustomId('birthday')
		.setLabel("Quand est votre anniversaire ?")
		.setValue("JJ/MM/AAAA")
		.setMinLength(10)
		.setMaxLength(10)
		.setRequired(true)
		.setStyle(TextInputStyle.Short)

		const a_i_birthday = new ActionRowBuilder().addComponents(i_birthday);

		m_anniversaire.addComponents(a_i_birthday);

		await interaction.showModal(m_anniversaire);
	}
}