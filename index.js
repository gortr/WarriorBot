const {
  Client, 
  Attachment, 
  RichEmbed
} = require('discord.js');

const bot = new Client();

const ytdl = require("ytdl-core");

const token = 'NTk4MjI0MjEwNjIzNTk0NTE4.XSTsLQ.YHoWtN5n-9rA0MFy-_fx1bSJ3nc';

const PREFIX = '!';

var version = '1.0.2';

const usedCommandRecently = new Set();

var servers = {};

// Terminal Notification that the bot is Online!
bot.on('ready', () =>{
  console.log('This bot is online!');
  bot.user.setActivity('Pokemon - Red Version', { type: "PLAYING" }).catch(console.error);
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
      //message.reply('pong!'); //If we want the bot to respond to a specific person that commenced the command
      message.channel.sendMessage('pong!'); //If we want the bot to respond without adding the @ for the user.
      break;

    // Sends user the link for the YouTube channel of the guild/community/group.
    case 'youtube':
      message.channel.sendMessage('https://www.youtube.com/warriorbambino')
      break;

    // Allows users to play music in their voice channel.
    case 'play':
        function play(connection, message){
          var server = servers[message.guild.id];

          server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

          // Shifts the bot music player into the next song in the queue.
          server.queue.shift();

          server.dispatcher.on("end", function() {
            if(server.queue[0]){
              play(connection, message);
            } else{
              connection.dispatcher();
            }
          });
        }

        if(!args[1]){
          messsage.channel.send("You need to provide a link for the song you want played!");
          return;
        }

        if(!message.member.voiceChannel){
          message.channel.send("You must be in a voice channel to play the bot!");
          return;
        }

        if(!servers[message.guild.id]) servers[message.guild.id] = {
          queue: []
        }

        var server = servers[message.guild.id];

        server.queue.push(args[1]);

        if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
          play(connection, message);
        })

      break;

    case 'skip':
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
  }
})

bot.on('message', msg=>{
  if(msg.content === "HELLO" || msg.content === "hello" || msg.content === "Hello"){
    msg.reply('HELLO FRIEND!');
  }
})

bot.login(token);