const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { token } = require('./config.json');
const internal = require('node:stream');
const { title } = require('node:process');
const cron = require('node-cron');
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

    // Check for birthdays
    const today = new Date();
    const birthday = require('./birthday.json');
    for (const [user_id, timestamp_birthday] of Object.entries(birthday)) {
        if (today.getDate() === new Date(timestamp_birthday * 1000).getDate() &&
            today.getMonth() === new Date(timestamp_birthday * 1000).getMonth()) {
            readyClient.channels.cache.get('1040645618802114605').send(`<a:cafeeDancing:1284232509239988246>Joyeux anniversaire <@${user_id}> !`);
        }
    }

    // Cron job for reminders
    cron.schedule('* * * * *', () => { // Every minute
        const currentTime = Math.floor(Date.now() / 1000); // Current timestamp
        const remindersFile = './reminders.json';
        
        if (fs.existsSync(remindersFile)) {
            let reminders = JSON.parse(fs.readFileSync(remindersFile));

            // Filter and notify reminders
            reminders = reminders.filter(reminder => {
                if (reminder.timestamp <= currentTime) {
                    // Send reminder message and ping user
					const em_reminders = new EmbedBuilder()
					.setColor('#0099ff')
					.setTitle('__Votre rappel__')
					.addFields(
						{ name: "Titre", value: reminder.title },
						{ name: "Description:", value: reminder.description }
					)
					.setTimestamp()
					.setFooter({ text: 'Fait par Rayreth avec 💖', iconURL: 'https://cdn.discordapp.com/icons/1040645618311385158/577f596043d0ea6a4cc91859cebfcf11.webp?size=160'});
                    readyClient.channels.cache.get('1263938774627258368').send({content: `<:cofeeNoted:1287050059715838023> <@${reminder.discordId}> La date limite de votre rappel **${reminder.title}** vient d'arriver à échéance !`, embeds: [em_reminders]});

                    return false; // Remove reminder after sending
                }
                return true; // Keep the reminder
            });

            // Save updated reminders back to the file
            fs.writeFileSync(remindersFile, JSON.stringify(reminders, null, 2));
        }
    });

    // Scheduled message for users
    cron.schedule('0 21 * * *', () => {
        readyClient.channels.cache.get('1040645618802114605').send(`<@927450521302863942> et <@477869784932024321> Aller dormir or consequences <:cofeeBan:1286735536794501142> !`);
    });
	 // Scheduled message for users
	 cron.schedule('0 22 * * *', () => {
        readyClient.channels.cache.get('1040645618802114605').send(`<@927450521302863942> et <@477869784932024321> Aller dormir or consequences <:cofeeBan:1286735536794501142> !`);
    });
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
			await interaction.followUp({ content: `<:cofeerd:1284232054296281249> Une erreur s'est produite lors de l'exécution de cette commande !`, ephemeral: true });
		} else {
			await interaction.reply({ content: `<:cofeerd:1284232054296281249> Une erreur s'est produite lors de l'exécution de cette commande !`, ephemeral: true });
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
			
			const deadline = interaction.fields.getTextInputValue('deadline'); // Format: DD/MM/YYYY HH:mm
			const [datePart, timePart] = deadline.split(' '); // Split into date and time
			const [day, month, year] = datePart.split('/'); // Split date into day, month, year
			const [hours, minutes] = timePart.split(':'); // Split time into hours and minutes
			
			// Create a timestamp including hours and minutes
			const timestamp_deadline = new Date(year, month - 1, day, hours, minutes).getTime() / 1000;
			
			const title = interaction.fields.getTextInputValue('title');
			const description = interaction.fields.getTextInputValue('description');
			let reminders = [];
			let newId = 1;
			
			if (fs.existsSync("./reminders.json")) {
				const data = fs.readFileSync("./reminders.json");
				reminders = JSON.parse(data);
				if (reminders.length > 0) {
					const highestId = Math.max(...reminders.map(reminder => reminder.id));
					newId = highestId + 1;
				}
			}
			
			reminders.push({
				id: newId,
				discordId: interaction.user.id,
				title: title,
				description: description,
				timestamp: timestamp_deadline
			});
			
			fs.writeFileSync("./reminders.json", JSON.stringify(reminders, null, 2));
			interaction.reply({ content: '<:cofeeNoted:1287050059715838023> Votre rappel a été enregistré avec succès !', ephemeral: true });					 
		}
	}
});

client.login(token);