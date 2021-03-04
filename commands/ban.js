module.exports = {
    name: 'ban',
    description: 'Ban a User Command',
    async execute(message, args){
        let role = message.guild.roles.cache.find(r => r.name === 'WG Admin Team' || 'WG Moderator Team');

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
    },
};