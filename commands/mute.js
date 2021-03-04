module.exports = {
    name: 'mute',
    description: 'Allows the user to create a temporary mute timelapse on a specific user within the Discord server.',
    execute(message, args){
        let person = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]))
            if(!person) return message.reply("Unable to mute the indicated person as they do not exist.");

            let mainrole = message.guild.roles.find(role => role.name === "Member");
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
    }
}