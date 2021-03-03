/*
Warrior Gaming Discord Bot
Made by Rigoberto "Rygol" Gort
Last Updated: 3/3/2021
*/

// Imports Token for Bot Usage and Onlining
require('dotenv').config();

// Imports necessary Discord components for the Bot to function accordingly.
// Sets up initial parameters for Bot usage.
const { Discord, Client, WebHookClient, WebhookClient, DiscordAPIError, Collection } = require('discord.js');
const bot = new Client({
    partials: ['MESSAGE', 'REACTION']
});
const webhookClient = new WebhookClient(
    process.env.WEBHOOK_ID,
    process.env.WEBHOOK_TOKEN,
);
var version = '1.0.1c';   // Provides the Bot current version if requested by a User.
const PREFIX = "`";   // The intended prefix usaed for Bot commands within a server.
const fs = require('fs');   // Allows access to files and folders within the directory.
bot.commands = new Collection();   // Collection for all commands.

// Provides access to a commands directory for the Bot to access for commands processing.
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
  const command = require(`./commands/${file}`);
  bot.commands.set(command.name, command);
}




// Provides a console log to indicate that the Bot is online.
// Allows dev/user to set the Bot activity per their specifications.
bot.once('ready', () => {
    console.log(`${bot.user.tag} is online!`);
    bot.user.setActivity('Improving Codebase', { type: "PLAYING" }).catch(console.error);
});

// When a new User joins the server they will be greeted by the Bot.
bot.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find(channel => channel.name === 'general');
    if(!channel) return;
  
    channel.send(`Welcome to our amazing community ${member}! Please read the rules in the #welcome-rules channel.`)
});



// BOT SERVER COMMANDS LISTING FOR USERS OR DEVELOPERS
// Handles commands made to the Bot in order to process them per the User utilizing them.
bot.on('message', async (message) => {
    if(!message.content.startsWith(PREFIX) || message.author.bot) return;   // Checks to confirm that the command is structure correctly and is not being requested by the Bot.
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    /*if(message.content.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = message.content // Retrieves command used by User and all arguements following the command instead of just the one after it.
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);
    }*/

    if (!bot.commands.has(command)) {
    }
    try {
        bot.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an issue executing that command! It may be an invalid command.');
    }

    // Contains full list of Bot commands executable by the Bot per the Users requests.
    /*if(CMD_NAME === 'ping'){   // Sends user Pong response to their Ping command.
        bot.commands.get('ping').execute(message, args);
    } else if (CMD_NAME === 'youtube') {   // Sends user the link for the YouTube channel of the guild/community/group.
        bot.commands.get('youtube').execute(message, args);
    } else if (CMD_NAME === 'play') {   // Brings the Bot into the voice channel that the User is within for playing Music via YouTube.
        bot.commands.get('play').execute(message, args, servers, ytdl);
    } else if (CMD_NAME === 'skip') {   // Skips the current queue item that a User has added to the Bot queue for playing within the currently connected voice channel.
        return;
    } else if (CMD_NAME === 'pause') {   // Pauses the audio being played via the Bot within the voice channel that the User is within.
        return;
    } else if (CMD_NAME === 'resume') {   // Resumes the previously paused audio item within the queue that the User has specified.
        return;
    } else if (CMD_NAME === 'leave') {   // Informs the Bot to leave the currently connected voice channel that it was summoned to to begin with.
        return;
    } else if (CMD_NAME === 'mute') {   // Allows the User to create a temporary mute timelapse on a specific User within the Discord server.
        let person = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]))
      if(!person) return message.reply("Unable to mute the indicated person as they do not exist.");

      let mainrole = message.guild.roles.find(role => role.name === "Newbie");
      let muterole = message.guild.roles.find(role => role.name === "mute");

      if(!muterole) return message.reply("Unable to locate the mute role within this Discord server.");

      let time = args[2];

      if(!time){
        return message.reply("You didn't specify a time!");
      }

      person.removeRole(mainrole.id);
      person.addRole(muterole.id);

      message.channel.send(`@${person.user.tag} has now been muted for ${ms(ms(time))}`);

      setTimeout(function(){
        person.addRole(mainrole.id);
        person.removeRole(muterole.id);
        message.channel.send(`@${person.user.tag} has been unmuted!`)
      }, ms(time));
    } else if (CMD_NAME === 'commands') {   // Sends User list of available commands for the Bot within the Discord channel they requested it.
        message.channel.send('Error, commands list not configured as of yet!')
    } else if (CMD_NAME === 'react') {   // Create reaction to User message from Bot.
        message.react("⚔️");
    } else if (CMD_NAME === 'send') {   // Setup later on in order to send attachments for Guild files such as ZvZ and GvG build books.
        const attachment = new Attachment('https://y4j7y8s9.ssl.hwcdn.net/wp-content/uploads/2018/04/discordpromo-1024x576.jpg')
        message.channel.send(message.author, attachment);
    } else if (CMD_NAME === 'cooldown') {   // Keeps the User from spamming commands repeatedly.
        if(usedCommandRecently.has(message.author.id)){
            message.reply("You cannot use that command just yet! Wait another 30 seconds!");
          } else{
            message.reply("You are not on cooldown! This is a custom command!");
  
            // Adds user to cooldown list and forces them to wait 10 seconds.
            usedCommandRecently.add(message.author.id);
            setTimeout(() => {
              usedCommandRecently.delete(message.author.id)
            }, 10000);
          }
    } else if (CMD_NAME === 'kick') {   // Allows a Moderator or Admin to kick a Member of the server utilizing the Bot via a command.
        // Checks to confirm if the User creating the command has permissions for said command.
        if (!message.member.hasPermission('KICK_MEMBERS'))
            return message.reply('You do not have permissions to use that command!')
            .then(message => message.delete(5000));

        // Checks to make sure a valid Member ID was entered by the User.
        if (args.length === 0)
            return message.reply('Please provide an ID');
        const member = message.guild.members.cache.get(args[0]);

        // Kicks the Member intended per the User that initiated this command.
        // Otherwise returns an error log or indicates that the User does not exist within the server.
        if (member) {
            member.kick('You were kicked from the Warrior Gaming server!')
            .then((member) => message.channel.send(`${member} was kicked from the server.`))
            .catch((err) => message.channel.send('I was unable to kick that user '));
            console.log(err);
        } else {
            message.reply("That user does not exist within the server!")
        }
    } else if (CMD_NAME === 'ban') {   // Allows a Moderator or Admin to ban a Member of the server utilizing the Bot via a command.
        // Checks to confirm if the User creating the command has permissions for said command.
        if (!message.member.hasPermission('BAN_MEMBERS'))
            return message.reply('You do not have permissions to use that command!')
            .then(message => message.delete(5000));

        // Checks to make sure a valid Member ID was entered by the User.
        if (args.length === 0)
            return message.reply('Please provide an ID');
        
        // Tries to get a User ID for banning, otherwise it will return an error indicating possible errors.
        try {
            const user =  await message.guild.members.ban(args[0]);
            console.log(user);
        } catch (err) {
            console.log(err);
            message.channel.send('An error has occurred. Either I lack the permissions or the user was not found.');
        }

        // Kicks the Member intended per the User that initiated this command.
        // Otherwise returns an error log or indicates that the User does not exist within the server.
        if (member) {
            member.ban('You were banned from the Warrior Gaming server!')
            .then((member) => message.channel.send(`${member} was banned from the server.`))
            .catch((err) => message.channel.send('I was unable to ban that user '));
            console.log(err);
        } else {
            message.reply("That user does not exist within the server!")
        }
    } else if (CMD_NAME === 'version') { // The User will be provided the current Bot version per the current build.
        message.channel.send('Current Bot Version: ' + version);
    } else if (CMD_NAME === 'clear') {   // The User will be able to clear an amount of texts as determined by their input for this command.
        if(!args[1]) return message.reply('Error, please specify the amount of text to clear from the current channel.')
        message.channel.bulkDelete(args[1]);
    } else if (CMD_NAME === 'embed') {   // The User will be provided details as to their status on the current Discord server that the Bot is servicing.
        const embed = new RichEmbed()
        .setTitle('User Information')
        .addField('Player Name', message.author.username, true)
        .addField('Version', version, true)
        .addField('Current Server', message.guild.name, true)
        .setThumbnail(message.author.avatarURL)
        .setFooter('Subscribe to my YouTube!')
        .setColor(0x48C9B0)
        message.channel.sendEmbed(embed);
    } else if (CMD_NAME === 'help') {   // No Data Inputted
        const HelpEmbed = new RichEmbed()
        .setTitle("Helper Embed")
        .setColor(0xFF0000)
        .setDescription("The following are a list of commands available to you within the Warrior Gaming Server:");

        messsage.author.send(HelpEmbed);
    } else if (CMD_NAME === 'poll') {   // No Data Inputted
        const PollEmbed = new RichEmbed()
        .setColor(0xFFC300)
        .setTitle("Initiate Poll")
        .setDescription("!poll to initiate a simple yes or no poll");

        if(!args[1]){
          message.channel.send(PollEmbed);
        }

        let msgArgs = args.slice(1).join(" ");

        message.channel.send("🗳️ " + "**" + msgArgs + "**").then(messageReaction => {
          messageReaction.react("👍");
          messageReaction.react("👎");
          message.delete(2000).catch(console.error);
        });
    } else if (CMD_NAME === 'announce') {   // Allows the WG Team to push announcements to the announcements channel via the Bot without it showcasing a specific team member.
        console.log(args);
        const msg = args.join(' ');   // Eliminates extra whitespace within the message to make it seem as a fluid sentence or message.
        console.log(msg);
        webhookClient.send(msg);
    } else {   // If a command is not listed above, then the User will be provided with the following error message.
        message.channel.send("I'm sorry, that is an invalid command.");
    }*/
});



// Allows Bot to respond to users who say hello or Hello.
/*bot.on('message', (message) => {
    console.log(`[${message.author.tag}]: ${message.content}`);
    if(message.content === 'hello' || 'Hello'){
        message.channel.send('Hello there!');
    }
});*/



// NEED TO ADD MORE FUNCTIONALITY, ALMOST LIKE YAGDB BOT IN ORDER TO HAVE STEPS FOR CREATING REACTION ROLE MESSAGES WITHIN CERTAIN CHANNELS
// Allows Bot to apply roles to specific Users based on reaction provided to specific messages.
bot.on('messsageReactionAdd', (reaction, user) => {
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);
    if (reaction.message.id === '') {
        switch (name) {
            case '🚀':
                member.roles.add('role id');
                break;
        }
    }
});

// Allows Bot to remove roles to specific Users based on reaction provided to specific messages.
bot.on('messsageReactionRemove', (reaction, user) => {
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);
    if (reaction.message.id === '') {
        switch (name) {
            case '🚀':
                member.roles.remove('role id');
                break;
        }
    }
});

// Brings the Bot online for usage and functionality.
bot.login(process.env.DISCORDJS_BOT_TOKEN);