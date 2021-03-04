module.exports = {
    name: 'ping',
    description: 'Ping Command',
    execute(message, args){
        message.channel.send('Pong!'); //If we want the bot to respond without adding the @ for the user.
    },
};