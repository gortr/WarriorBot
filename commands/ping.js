module.exports = {
    name: 'ping',
    description: 'Ping Command',
    execute(message, args){
        //message.reply('pong!'); //If we want the bot to respond to a specific person that commenced the command
        message.channel.send('Pong!'); //If we want the bot to respond without adding the @ for the user.
    },
};