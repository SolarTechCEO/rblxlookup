// Const
const { CommandoClient } = require('discord.js-commando');
const commando = require('discord.js-commando');
const { Structures, DiscordAPIError, MessageEmbed, Collection } = require('discord.js');
require('discord-reply');
const path = require('path');
const http = require("http");
const express = require("express");
const { mySecret } = require('./config/config.json')
const keepAlive = require('./server');
const request = require('request-promise');


// Client
const client = new commando.CommandoClient({
  owner: ["YOUR DISCORD ID HERE"],
  commandPrefix: "PREFIX HERE",
  unknownCommandResponse: false,
  selfbot: false,
  commandEditableDuration: 60
});


// CONSOLE LOGGERS FOR ANY ERRORS ETC
client
  .on('error', console.error)
  .on('warn', console.warn)
  .on('debug', console.log)
  .on('ready', () => {
    console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
  })
  .on('disconnect', () => { console.warn('Disconnected!'); })
  .on('reconnecting', () => { console.warn('Reconnecting...'); })
  .on('commandError', (cmd, err) => {
    if (err instanceof commando.FriendlyError) return;
    console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
  })
  .on('commandBlocked', (msg, reason) => {
    console.log(oneLine`
             Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
             blocked; ${reason}
         `);
  })
  .on('commandPrefixChange', (guild, prefix) => {
    console.log(oneLine`
             Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
             ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
        `);
  })
  .on('commandStatusChange', (guild, command, enabled) => {
    console.log(oneLine`
             Command ${command.groupID}:${command.memberName}
             ${enabled ? 'enabled' : 'disabled'}
             ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
         `);
  })
  .on('groupStatusChange', (guild, group, enabled) => {
    console.log(oneLine`Group ${group.id} ${enabled ? 'enabled' : 'disabled'} ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.`);
  });


// Registrys
client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['neu', 'Miscellaneous Commands']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    help: true,
    ping: false,
    eval: true,
    unknownCommand: false,
    commandPrefix: false,
    commandState: false
  })
  .registerCommandsIn(path.join(__dirname, 'commands'));





// Client Login
keepAlive();
client.login(mySecret);
