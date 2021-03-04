module.exports = {
    name: 'kick',
    description: 'Kick a User Command',
    execute(message, args){
        let role = message.guild.roles.cache.find(r => r.name === 'WG Admin Team' || 'WG Moderator Team');

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
    },
};