const { SlashCommandBuilder, InteractionResponse, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder} = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playlist')
		.setDescription('Obtenir le lien de la cofee playlist !'),
	async execute(interaction) {
        const b_links = new ButtonBuilder()
           .setEmoji("<:cofeeMusic:1286730053924950057>")
           .setLabel('La cofee playlist')
           .setURL('https://open.spotify.com/playlist/6G8TMlI98B7r1ofStCqPal?si=ZFrHsoLCRW62NtLi_UHcPA')
           .setStyle(ButtonStyle.Link);
           
        const row = new ActionRowBuilder()
           .addComponents(b_links);   
           
        interaction.reply({content: `<:cofeeComputer:1287000487316557847> Voici le liens de la **cofee playlist** !`, components: [row]});
    }
}