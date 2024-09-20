const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { token } = require('./config.json');
const internal = require('node:stream');
const { title } = require('node:process');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	//check if an user has a birthday today regardles of the year
	const today = new Date();
	const today_timestamp = today.getTime() / 1000;
	const birthday = require('./birthday.json');
	for (const [user_id, timestamp_birthday] of Object.entries(birthday)) {
		if (today.getDate() === new Date(timestamp_birthday * 1000).getDate() && today.getMonth() === new Date(timestamp_birthday * 1000).getMonth()) {
			// send to a specific channel a message
			readyClient.channels.cache.get('1040645618802114605').send(`<a:cafeeDancing:1284232509239988246>Joyeux anniversaire <@${user_id}> !`);
		}
	}
});

client.on(Events.InteractionCreate, async interaction => {
	if(interaction.isChatInputCommand()){
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: '<:cofeerd:1284232054296281249>There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: '<:cofeerd:1284232054296281249>There was an error while executing this command!', ephemeral: true });
		}
	}
	}
	else if(interaction.isModalSubmit()){
		if(interaction.customId === 'anniversaire'){
			const birthday = interaction.fields.getTextInputValue('birthday');
			//birthday is in the format JJ/MM/AAAA covert it to timestamp
			const [day, month, year] = birthday.split('/');
			const timestamp_birthday = new Date(year, month - 1, day).getTime() / 1000;
			//add the timestamps and user id to the birthday.json file
			//add the timestamps and user id to the birthday.json file on a new line
			fs.readFile('./birthday.json', (err, data) => {
				if (err) {
					console.log(err);
					interaction.reply({content: '<:cofeerd:1284232054296281249>Il y a eu une erreur lors de l\'enregistrement de votre anniversaire.', ephemeral: true});
				}
				const birthday = JSON.parse(data);
				birthday[interaction.user.id] = timestamp_birthday;
				fs.writeFile('./birthday.json', JSON.stringify(birthday), (err) => {
					if (err) {
						console.log(err);
						interaction.reply({content: '<:cofeerd:1284232054296281249>Il y a eu une erreur lors de l\'enregistrement de votre anniversaire.', ephemeral: true});
					}
					interaction.reply({content: `<:cofeeCool:1284231863820353566>Votre anniversaire a été enregistré avec succès pour le <t:${timestamp_birthday}:D> !`, ephemeral: true});
				}
			)}
			)
		}
		else if(interaction.customId == 'reminder'){
			
			const deadline = interaction.fields.getTextInputValue('deadline');
			const [day, month, year] = deadline.split('/');
			const timestamp_deadline = new Date(year, month - 1, day).getTime() / 1000
			const title = interaction.fields.getTextInputValue('title');
			const description = interaction.fields.getTextInputValue('description');
			let reminders = []
			if (fs.existsSync("./reminders.json")) {
				const data = fs.readFileSync("./reminders.json");
				reminders = JSON.parse(data);
			}
			reminders.push({
				discordId: interaction.user.id,
				title: title,
				description: description,
				timestamp: timestamp_deadline
			  });
			fs.writeFileSync("./reminders.json", JSON.stringify(reminders, null, 2));
			interaction.reply({content: '<:cofeeCool:1284231863820353566> Votre rappel à été enregistré avec succées !', ephemeral:true})         
		}
	}
});

client.login(token);