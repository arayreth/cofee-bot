const { error } = require('console');
const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addrappel')
		.setDescription('Ajouter un rappel.'),
	async execute(interaction) {
		const m_reminder = new ModalBuilder()
		.setCustomId('reminder')
		.setTitle('Ajouter un rappel.')

		const i_deadline = new TextInputBuilder()
		.setCustomId('deadline')
		.setLabel("Quand est la date limite du rappel ?")
		.setValue("JJ/MM/AAAA")
		.setMinLength(10)
		.setMaxLength(10)
		.setRequired(true)
		.setStyle(TextInputStyle.Short)

        const i_title = new TextInputBuilder()
        .setCustomId('title')
        .setLabel("Quel est le titre du rappel ?")
        .setMinLength(2)
        .setMaxLength(100)
        .setRequired(true)
        .setStyle(TextInputStyle.Short)

        const i_description = new TextInputBuilder()
        .setCustomId('description')
        .setLabel('Quel est la description du rappel ?')
        .setMinLength(2)
        .setMaxLength(400)
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph)

		const a_i_deadline = new ActionRowBuilder().addComponents(i_deadline);
        const a_i_title = new ActionRowBuilder().addComponents(i_title);
        const a_i_description = new ActionRowBuilder().addComponents(i_description)

		m_reminder.addComponents(a_i_deadline, a_i_title, a_i_description);

		await interaction.showModal(m_reminder);
	}
}