module.exports = {
    name: 'embed',
    description: 'Embed Message Command',
    execute(message, args, MessageEmbed, version){
        const newEmbed = new MessageEmbed()
        .setTitle('User Information')
        .addField('Member Name', message.author.username, true)
        .addField('Bot Version', version, true)
        .addField('Current Server', message.guild.name, true)
        .setThumbnail(message.author.avatarURL)
        .setImage('https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Antu_im-invisible-user.svg/1024px-Antu_im-invisible-user.svg.png')
        .setFooter('Subscribe to the Official YouTube Channel!\n Use command: `youtube')
        .setColor(0x48C9B0);
        message.channel.send(newEmbed);
    },
};