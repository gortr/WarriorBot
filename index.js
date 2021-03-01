/*
Warrior Gaming Discord Bot
Made by Rigoberto "Rygol" Gort
Last Updated: 3/23/2020
*/

// Require discord.js
const Discord = require('discord.js');

// Discord.js Client (Bot)
const bot = new Discord.Client({
  disableEveryone: true
});

// Indicates the bot version based on patches/updates/changes.
var version = '1.0.3';

// Setups up the required command prefix in order to operate the bot.
const PREFIX = '`';

// Required for muting a player for xyz amount of time.
const ms = require('ms');

// Required for streaming music with the bot.
const ytdl = require("ytdl-core");

// Token for bot to operate via API system.
const token = 'NTk4MjI0MjEwNjIzNTk0NTE4.XemKBw.WcJe5l-gN8xnn-nzj-YmkZ3lKyM';

// Collection for all commands.
bot.commands = new Discord.Collection();

// Setups and reads all the files within the collection for the bots commands.
const fs = require('fs');

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
  const command = require(`./commands/${file}`);

  bot.commands.set(command.name, command)
}

const usedCommandRecently = new Set();

var servers = {};

// Terminal Notification that the bot is online!
bot.on('ready', () =>{
  console.log(`${bot.user.username} is online on ${bot.guilds.size} server!`);
  bot.user.setActivity('Escape From Tarkov', { type: "PLAYING" }).catch(console.error);
})

// Server Greeting for New Members
bot.on('guildMemberAdd', member =>{
  const channel = member.guild.channels.find(channel => channel.name === 'general');
  if(!channel) return;

  channel.send(`Welcome to our amazing community ${member}! Please read the rules in the #welcome-rules channel.`)
})

// Command Messages for the Bot
bot.on('message', message=>{

  let args = message.content.substring(PREFIX.length).split(" ");

  switch(args[0]){
    case 'ping':
      bot.commands.get('ping').execute(message, args);
      break;

    // Sends user the link for the YouTube channel of the guild/community/group.
    case 'youtube':
      bot.commands.get('youtube').execute(message, args);
      break;

    /*// Allows users to play music in their voice channel.
    case 'play':
      bot.commands.get('play').execute(message, args, servers, ytdl);
      break;

    case 'skip':
      bot.commands.get('skip').execute(message, args, servers);
      break;

    case 'pause':
      bot.commands.get('pause').execute(message, args, servers);
      break;

    case 'resume':
      bot.commands.get('resume').execute(message, args, servers);
      break;

    case 'leave':
      bot.commands.get('leave').execute(message, args, servers);
      break;*/

    // Allows the user to create a temporary mute timelapse on a specific user within the Discord server.
    case 'mute':
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

      break;

    // Sends user list of available commands for the bot within the Discord channel they requested it.
    case 'commands':
      message.channel.sendMessage('Error, commands list not configured as of yet!')
      break;

    // Create reaction to user message from bot.
    case 'react':
        message.react("⚔️");
      break;

    // Setup later on in order to send attachments for guild files such as ZvZ and GvG build books.
    case 'send':
      const attachment = new Attachment('https://y4j7y8s9.ssl.hwcdn.net/wp-content/uploads/2018/04/discordpromo-1024x576.jpg')
      message.channel.send(message.author, attachment);
      break;

    // Sends locally available files from within Discord bot primary folder.
      /*case 'sendLocal':
        const attachment1 = new Attachment('./image.jpg')
        message.channel.send(message.author, attachment1);
        break;*/

    // Keeps the user from spamming commands repeatedly.
    case 'cooldown':
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
      break;

    // Allows a moderator or admin to kick a member of the server utilizing the bot via a command.
    case 'kick':
        // Gets first user mentioned after the !kick command.
        const user = message.mentions.users.first();

        if(message.member.roles.find(r => r.name === "Admin")){
          if(user){
            const member = messsage.guild.member(user);

            if(member){
              member.kick('You were kicked from the server!').then(() =>{
                message.reply(`Successfuly kicked ${user.tag}`);
              }).catch(err =>{
                message.reply('I was unable to kick the member from server.');
                console.log(err);
              }); 
            } else{
              message.reply("That user isn\'t in the server!")
            } 
          } else{
            message.reply("You need to specify a person!")
          }
        } else{
          message.channel.send('YOU DO NOT HAVE PERMISSIONS').then(msg => msg.delete(5000));
        } 
      break;

    // Allows a moderator or admin to ban a member of the server utilizing the bot via a command.
    case 'ban':
        // Gets first user mentioned after the !ban command.
        const userb = message.mentions.users.first();

        if(message.member.roles.find(r => r.name === "Admin")){
          if(userb){
            const member = message.guild.member(userb);
  
            if(member){
              member.ban({ression: 'You were banned from the server!'}).then(() =>{
                message.reply(`Ban hammer was dropped on ${userb.tag}`);
              }).catch(err =>{
                message.reply('I was unable to ban the member from server.');
                console.log(err);
              }); 
            } else{
              message.reply("That user isn\'t in the server!")
            } 
          } else{
            message.reply("You need to specify a person!")
          }
        } else{
          message.channel.send('YOU DO NOT HAVE PERMISSIONS').then(msg => msg.delete(5000));
        } 
      break;

    // Sends the user details as to the Discord bots current version.
    case 'info':
      if(args[1] === 'version'){
        message.channel.sendMessage('Version: ' + version);
      }

      // If a command is not listed above, then the user will be provided with the following error message.
      else{
        message.channel.sendMessage("I'm sorry, that is an invalid command.");
      }
      break;

    // The user will be able to clear an amount of texts as determined by their input for this command.
    case 'clear':
      if(!args[1]) return message.reply('Error, please specify the amount of text to clear from the current channel.')
      message.channel.bulkDelete(args[1]);
      break;

    // The user will be provided details as to their status on the current Discord server that the bot is servicing.
    case 'embed':
      const embed = new RichEmbed()
      .setTitle('User Information')
      .addField('Player Name', message.author.username, true)
      .addField('Version', version, true)
      .addField('Current Server', message.guild.name, true)
      .setThumbnail(message.author.avatarURL)
      .setFooter('Subscribe to my YouTube!')
      .setColor(0x48C9B0)
      message.channel.sendEmbed(embed);
      break;

    case 'help':
      const HelpEmbed = new RichEmbed()
        .setTitle("Helper Embed")
        .setColor(0xFF0000)
        .setDescription("The following are a list of commands available to you within the Warrior Gaming Server:");

        messsage.author.send(HelpEmbed);
      break;

    case 'poll':
        const PollEmbed = new RichEmbed()
        .setColor(0xFFC300)
        .setTitle("Initiate Poll")
        .setDescription("!poll to initiate a simple yes or no poll");

        if(!args[1]){
          message.channel.send(PollEmbed);
          break;
        }

        let msgArgs = args.slice(1).join(" ");

        message.channel.send("🗳️ " + "**" + msgArgs + "**").then(messageReaction => {
          messageReaction.react("👍");
          messageReaction.react("👎");
          message.delete(2000).catch(console.error);
        });

      break;
  }
})

bot.on('message', msg=>{
  if(msg.content === "HELLO" || msg.content === "hello" || msg.content === "Hello"){
    msg.reply('HELLO FRIEND!');
  }
})

bot.login(token);