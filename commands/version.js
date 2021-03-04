module.exports = {
    name: 'version',
    description: 'Allows a User to check on the current version of the Bot',
    execute(message, version){
        message.channel.send('Current Bot Version: ' + version);
    }
}