/*
Warrior Gaming Discord Bot
Made by Rigoberto "Rygol" Gort
Last Updated: 3/3/2021
*/

// Imports Token for Bot Usage and Onlining
require('dotenv').config();

// Imports necessary Discord components for the Bot to function accordingly.
// Sets up initial parameters for Bot usage.
const { Discord, Client, WebHookClient, WebhookClient, DiscordAPIError, Collection, MessageEmbed } = require('discord.js');
const bot = new Client({
    disableEveryone: true,
    partials: ['MESSAGE', 'REACTION']
});
const webhookClient = new WebhookClient(
    process.env.WEBHOOK_ID,   // Retrieves webhook id created by Discord server Bot is on.
    process.env.WEBHOOK_TOKEN,   // Retrieves webhook token created by Discord server Bot is on.
);
var version = '1.0.1c';   // Provides the Bot current version if requested by a User.
const PREFIX = "`";   // The intended prefix usaed for Bot commands within a server.
const fs = require('fs');   // Allows access to files and folders within the directory.
const ms = require('ms');   // Required for muting a player for xyz amount of time.
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
    const command = args.shift().toLowerCase();   // Contains full list of Bot commands executable by the Bot per the Users requests.
    
    if (command === 'ping') {
        bot.commands.get('ping').execute(message, args);
    } else if (command === 'youtube') {   // Brings the Bot into the voice channel that the User is within for playing Music via YouTube.
        bot.commands.get('youtube').execute(message, args);
    } else if (command === 'play') {   // Brings the Bot into the voice channel that the User is within for playing Music via YouTube.
        return;
    } else if (command === 'skip') {   // Skips the current queue item that a User has added to the Bot queue for playing within the currently connected voice channel.
        return;
    } else if (command === 'pause') {   // Pauses the audio being played via the Bot within the voice channel that the User is within.
        return;
    } else if (command === 'resume') {   // Resumes the previously paused audio item within the queue that the User has specified.
        return;
    } else if (command === 'leave') {   // Informs the Bot to leave the currently connected voice channel that it was summoned to to begin with.
        return;
    } else if (command === 'react') {   // Create reaction to User message from Bot.
        message.react("⚔️");
    } else if (command === 'send') {   // Setup later on in order to send attachments for Guild files such as ZvZ and GvG build books.
        const attachment = new Attachment('https://y4j7y8s9.ssl.hwcdn.net/wp-content/uploads/2018/04/discordpromo-1024x576.jpg')
        message.channel.send(message.author, attachment);
    } else if (command === 'cooldown') {   // Keeps the User from spamming commands repeatedly.
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
    } else if (command === 'kick') {   // Allows a Moderator or Admin to kick a Member of the server utilizing the Bot via a command.
        bot.commands.get('kick').execute(message, args);
    } else if (command === 'ban') {   // Allows a Moderator or Admin to ban a Member of the server utilizing the Bot via a command.
        bot.commands.get('ban').execute(message, args);
    } else if (command === 'version') { // The User will be provided the current Bot version per the current build.
        bot.commands.get('version').execute(message, version);
    } else if (command === 'clear') {   // The User will be able to clear an amount of texts as determined by their input for this command.
        bot.commands.get('clear').execute(message, args);
    } else if (command === 'embed') {   // The User will be provided details as to their status on the current Discord server that the Bot is servicing.
        bot.commands.get('embed').execute(message, args, MessageEmbed, version);
    } else if (command === 'help') {   // No Data Inputted
        bot.commands.get('help').execute(message, args, MessageEmbed);
    } else if (command === 'poll') {   // No Data Inputted
        const PollEmbed = new MessageEmbed()
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
    } else if (command === 'announce') {   // Allows the WG Team to push announcements to the announcements channel via the Bot without it showcasing a specific team member.
        console.log(args);
        const msg = args.join(' ');   // Eliminates extra whitespace within the message to make it seem as a fluid sentence or message.
        console.log(msg);
        webhookClient.send(msg);
    } else {   // If a command is not listed above, then the User will be provided with the following error message.
        message.reply('There was an issue executing that command! It may be an invalid command.');
    }
});



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