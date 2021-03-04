module.exports = {
    name: 'help',
    description: 'Help Embed Message Command',
    execute(message, args, MessageEmbed){
        const HelpEmbed = new MessageEmbed()
        .setTitle("Warrior Gaming Bot Help")
        .setColor(0xFF0000)
        .setDescription("The following are a list of commands available to you within the Warrior Gaming Server:")
        .addFields(
            {name: '`help', value: 'Brings up this help Embed for Users having issues with the Bot and its commands.'}
        );
        message.channel.send(HelpEmbed);
    },
};