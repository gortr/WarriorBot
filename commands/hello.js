module.exports = {
    name: 'hello',
    description: 'Hello Command',
    execute(message, args){
        console.log(`[${message.author.tag}]: ${message.content}`);
        message.channel.send('Hello there!'); //If we want the bot to respond without adding the @ for the user.
    },
};