module.exports = {
    name: 'clear',
    description: 'Clear a specified amount of text from a text channel that are less that 14 days old.',
    async execute(message, args){
        let role = message.guild.roles.cache.find(r => r.name === 'WG Admin Team' || 'WG Moderator Team');

        if (!message.member.permissions.has('MANAGE_MESSAGES')){
            return message.reply('You do not have permissions to use that command!')
            .then(message => message.delete(5000));
        }

        // Checks to see if the User only entered `clear without a number value after it.
        if(!args[0]) return message.reply('Error, please specify the amount of text to clear from the current channel.');
        
        // Checks to see if the User entered a character instead of a numeric value for the arguement parameter.
        if(isNaN(args[0])) return message.reply('Erorr, please enter a real number!');
        
        // Checks to see if the User is attempting to delete over 100 messages at a time within the command parameter.
        if(args[0] > 100) return message.reply('Error, please indicate a number less than 100 for clearing from the text channel specified!');
        
        // Checks to see if the User inputted a numerical value less than 1 for message deletion.
        if(args[0] < 1) return message.reply('Error, you must delete atleast one message!');
        
        await message.channel.messages.fetch({limit: args[0]}).then(messages => {
            // Deletes the specified number of messages if all IF statements above have not been triggered.
            message.channel.bulkDelete(messages);
        });
    },
};