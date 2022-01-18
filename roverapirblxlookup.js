// This is the RoverAPI Version!

const { MessageEmbed, Discord } = require('discord.js');
const { Command } = require('discord.js-commando');
const request = require('request-promise');
const db = require('quick.db');

module.exports = class rblxlookup extends Command {
  constructor(client) {
    super(client, {
	   name: 'rblxlookup',
		aliases: ['rblxl', 'rblookup', 'rblxsearch'],
		group: 'admin',
		memberName: 'rblxlookup',
		description: 'Lookups up a user with RoverAPI.',
		guildOnly: true,
		args: [
		   {
			  type: 'user',
			  prompt: 'Please mention the user you would like to roblox search!',
			  key: 'argUser',
			  default: ""
		   }
		 ]
	  });
	}
  
  async run(msgObject, { argUser }) {

	const blacklists = db.get(`blacklist_${msgObject.author.id}`);

	if(blacklists === true) {
		msgObject.reply(`You are currently blacklisted from this techonolgy!`);
		return;
	} 
	  
	  if (argUser === "") {
		argUser = msgObject.author
	  }

  const blacklist = db.get(`blacklist_${argUser.id}`);

  const admincheck = db.get(`admincheck_${argUser.id}`);

  const supportcheck = db.get(`supportcheck_${argUser.id}`);

	  let editMsg = await msgObject.reply(`Fetching ${argUser} roblox data....`);

		let data = await request({
			uri: `https://verify.eryn.io/api/user/${argUser.id}`,
			json: true,
			simple: false
		  });
		  if (data.robloxUsername !== undefined) {
			editMsg.edit("A roblox account is linked! Fetching data...");
			let Data = await request({
			  uri: `https://api.roblox.com/users/get-by-username?username=${data.robloxUsername}`,
			  json: true,
			  simple: false
			});
			const profileLink = `https://www.roblox.com/users/${data.robloxId}/profile`;
			const avatarURLi = `https://assetgame.roblox.com/Thumbs/Avatar.ashx?username=${encodeURIComponent(
			  data.robloxUsername
			)}`;

      const avatarURLdata = await request({
          uri: `https://thumbnails.roblox.com/v1/users/avatar?userIds=${data.robloxId}&size=720x720&format=png&isCircular=false`,
          json: true
      }); 
      
      const avatarURL = avatarURLdata.data[0].imageUrl
	  
			const profileSource = await request({
				uri: profileLink
			 });
	  
			let rblxdata = await request({
			   uri: `https://users.roblox.com/v1/users/${data.robloxId}`,
			   json: true,
			   simple: false
			 });
	  
			 let rblxdata2 = await request({
			   uri: `https://users.roblox.com/v1/users/${data.robloxId}/username-history`,
			   json: true,
			   simple: false
			 });

        let pastNames = ''
        try {
          const pastNamesData = await request({
            uri: `https://users.roblox.com/v1/users/${data.robloxId}/username-history?limit=50&sortOrder=Desc`,
            json: true,
            simple: false
          })
          pastNamesData.data.forEach(oldname => { pastNames += `, ${oldname.name}` })
          if (pastNames) pastNames = pastNames.replace(', ', '')
        } catch (e) {}

        let mainm = msgObject.mentions.members.first();

      if(blacklist === null) {
        let iembed = new MessageEmbed()
       .setTitle(`Discord Status`)
       .setThumbnail(argUser.avatarURL())
       .addField("Username:", argUser.username, true)
       .addField("Tag:", argUser.tag, true)
       .addField("ID:", argUser.id, true)
       .addField("Created:", argUser.createdAt);
       if (admincheck === true) {
         let eas = mainm.roles.highest;
         iembed.setColor(eas.color)
         iembed.fields.push({
           name: 'SolarTech Administration Position:', 
           value: mainm.roles.highest
         })
         iembed.fields.push({
           name: 'SolarTech Blacklisted:',
           value: 'This user can **NOT** be blacklisted.'
         })
         iembed.setDescription('🛠️ **__This User Is A Official Solar Technology Administrator!__** 🛠️')
       } else if(supportcheck === true) {
         iembed.setColor("GREEN")
         iembed.setDescription('**__This User Is A Official Solar Technology Support Member!__**')
         iembed.addField(`Support Team Position:`, mainm.roles.highest)
         iembed.addField("SolarTech Blacklisted:", "false")
       } else {
         iembed.setColor("GREEN")
         iembed.addField("SolarTech Blacklisted:", "false")
       }
       iembed.setFooter("Solar Techonlogy", "https://cdn.discordapp.com/avatars/681375746920284161/0dfd31817fd8cdd3a4a3e89f2d6ec6cd.webp?size=128")
       msgObject.channel.send(iembed);
      } else {
        let iembed = new MessageEmbed()
       .setTitle(`Discord Status`)
       .setThumbnail(argUser.avatarURL())
       .addField("Username:", argUser.username, true)
       .addField("Tag:", argUser.tag, true)
       .addField("ID:", argUser.id, true)
       .addField("Created:", argUser.createdAt);
       if (admincheck === true) {
         let eas = mainm.roles.highest;
         iembed.setColor(eas.color)
         iembed.fields.push({
           name: 'SolarTech Administration Position:', 
           value: mainm.roles.highest
         })
         iembed.fields.push({
           name: 'SolarTech Blacklisted:',
           value: 'This user can **NOT** be blacklisted.'
         })
         iembed.setDescription('🛠️ **__This User Is A Official Solar Technology Administrator!__** 🛠️')
       } else if(supportcheck === true) {
         iembed.setColor("RED")
         iembed.setDescription('**__This User Is A Official Solar Technology Support Member!__**')
         iembed.addField(`Support Team Position:`, mainm.roles.highest)
         iembed.addField("SolarTech Blacklisted:", "true")
       } else {
         iembed.setColor("RED")
         iembed.addField("SolarTech Blacklisted:", "true")
       }
       iembed.setFooter("Solar Techonlogy", "https://cdn.discordapp.com/avatars/681375746920284161/0dfd31817fd8cdd3a4a3e89f2d6ec6cd.webp?size=128")
       msgObject.channel.send(iembed);
      }

        let me = {}
        try {
          me = await request({
            uri: `https://users.roblox.com/v1/users/${data.robloxId}`,
            json: true,
            simple: false
          })
        } catch (e) {}

        if (me.name) {
          data.robloxUsername = me.name
        }

        if(rblxdata.description == "") {
          rblxdata.description = "This user does not have set description";
        };

			 let embed = new MessageEmbed()
			 .setTitle(`Roblox Status`)
			 .setColor("RANDOM")
			 .setThumbnail(avatarURL)
			 .addField('Username:', Data.Username, true)
        if (me.displayName !== me.name) {
          embed.fields.push({
            name: 'Display Name:',
            value: me.displayName,
            inline: true
          })
        }
			embed.addField('ID:', data.robloxId, true)
      if (pastNames && pastNames !== []) {
          embed.fields.push({
            name: 'Past Usernames:',
            value: pastNames,
            inline: true
          })
        };
			 embed.addField("Account Link:", `[Detailed Link](${profileLink})`)
       embed.addField('Description:', rblxdata.description)
			 embed.addField("Account Creation Date:", rblxdata.created)
			 embed.addField("Banned:", rblxdata.isBanned)
			 embed.setFooter("Solar Techonlogy", "https://cdn.discordapp.com/avatars/681375746920284161/0dfd31817fd8cdd3a4a3e89f2d6ec6cd.webp?size=128");


			 editMsg.edit(embed)
	  } else {
		  editMsg.edit('This user is not connected to RoverAPI but I will still show their discord status!');
        let mainm = msgObject.mentions.members.first();

      if(blacklist === null) {
        let iembed = new MessageEmbed()
       .setTitle(`Discord Status`)
       .setThumbnail(argUser.avatarURL())
       .addField("Username:", argUser.username, true)
       .addField("Tag:", argUser.tag, true)
       .addField("ID:", argUser.id, true)
       .addField("Created:", argUser.createdAt);
       if (admincheck === true) {
         let eas = mainm.roles.highest;
         iembed.setColor(eas.color)
         iembed.fields.push({
           name: 'SolarTech Administration Position:', 
           value: mainm.roles.highest
         })
         iembed.fields.push({
           name: 'SolarTech Blacklisted:',
           value: 'This user can **NOT** be blacklisted.'
         })
         iembed.setDescription('🛠️ **__This User Is A Official Solar Technology Administrator!__** 🛠️')
       } else if(supportcheck === true) {
         iembed.setColor("GREEN")
         iembed.setDescription('**__This User Is A Official Solar Technology Support Member!__**')
         iembed.addField(`Support Team Position:`, mainm.roles.highest)
         iembed.addField("SolarTech Blacklisted:", "false")
       } else {
         iembed.setColor("GREEN")
         iembed.addField("SolarTech Blacklisted:", "false")
       }
       iembed.setFooter("Solar Techonlogy", "https://cdn.discordapp.com/avatars/681375746920284161/0dfd31817fd8cdd3a4a3e89f2d6ec6cd.webp?size=128")
       msgObject.channel.send(iembed);
      } else {
        let iembed = new MessageEmbed()
       .setTitle(`Discord Status`)
       .setThumbnail(argUser.avatarURL())
       .addField("Username:", argUser.username, true)
       .addField("Tag:", argUser.tag, true)
       .addField("ID:", argUser.id, true)
       .addField("Created:", argUser.createdAt);
       if (admincheck === true) {
         let eas = mainm.roles.highest;
         iembed.setColor(eas.color)
         iembed.fields.push({
           name: 'SolarTech Administration Position:', 
           value: mainm.roles.highest
         })
         iembed.fields.push({
           name: 'SolarTech Blacklisted:',
           value: 'This user can **NOT** be blacklisted.'
         })
         iembed.setDescription('🛠️ **__This User Is A Official Solar Technology Administrator!__** 🛠️')
       } else if(supportcheck === true) {
         iembed.setColor("RED")
         iembed.setDescription('**__This User Is A Official Solar Technology Support Member!__**')
         iembed.addField(`Support Team Position:`, mainm.roles.highest)
         iembed.addField("SolarTech Blacklisted:", "true")
       } else {
         iembed.setColor("RED")
         iembed.addField("SolarTech Blacklisted:", "true")
       }
       iembed.setFooter("Solar Techonlogy", "https://cdn.discordapp.com/avatars/681375746920284161/0dfd31817fd8cdd3a4a3e89f2d6ec6cd.webp?size=128")
       msgObject.channel.send(iembed);
      }
	  }
  }
}
