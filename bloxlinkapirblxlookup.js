// Bloxlink API Version

const { MessageEmbed, Discord } = require('discord.js');
const { Command } = require('discord.js-commando');
const request = require('request-promise');
const db = require('quick.db');

module.exports = class rblxlookup extends Command {
  constructor(client) {
    super(client, {
	   name: 'rblxlookup',
		aliases: ['rblxl', 'rblookup', 'rblxsearch'],
		group: 'neu',
		memberName: 'rblxlookup',
		description: 'Lookups up a user with BloxlinkAPI.',
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

    if(argUser == "") {
      argUser = msgObject.author
    }


    let editMsg = await msgObject.reply(`Fetching ${argUser} roblox data....`);


		let data = await request({
			uri: `https://api.blox.link/v1/user/${argUser.id}`,
			json: true,
			simple: false
		  });

      let mains = await request({
			   uri: `https://users.roblox.com/v1/users/${data.primaryAccount}`,
			   json: true,
			   simple: false
			 });

      let robloxUsername = mains.name;

		  if (data.primaryAccount === undefined) {
		  editMsg.edit('This user is not connected to BloxlinkAPI but I will still show their discord status!');
        let mainm = msgObject.mentions.members.first();

        let iembed = new MessageEmbed()
       .setColor("RANDOM")
       .setTitle(`Discord Status`)
       .setThumbnail(argUser.avatarURL())
       .addField("Username:", argUser.username, true)
       .addField("Tag:", argUser.tag, true)
       .addField("ID:", argUser.id, true)
       .addField("Created:", argUser.createdAt);
       iembed.setFooter("Powered by SolarTech", "https://cdn.discordapp.com/avatars/681375746920284161/0dfd31817fd8cdd3a4a3e89f2d6ec6cd.webp?size=128")
       msgObject.channel.send(iembed);

      } else {

			editMsg.edit("A roblox account is linked! Fetching data...");
			let Data = await request({
			  uri: `https://api.roblox.com/users/get-by-username?username=${robloxUsername}`,
			  json: true,
			  simple: false
			});
			const profileLink = `https://www.roblox.com/users/${data.primaryAccount}/profile`;
			const avatarURLi = `https://assetgame.roblox.com/Thumbs/Avatar.ashx?username=${encodeURIComponent(
			  robloxUsername
			)}`;

      const avatarURLdata = await request({
          uri: `https://thumbnails.roblox.com/v1/users/avatar?userIds=${data.primaryAccount}&size=720x720&format=png&isCircular=false`,
          json: true
      }); 
      
      const avatarURL = avatarURLdata.data[0].imageUrl
	  
			const profileSource = await request({
				uri: profileLink
			 });
	  
			let rblxdata = await request({
			   uri: `https://users.roblox.com/v1/users/${data.primaryAccount}`,
			   json: true,
			   simple: false
			 });
	  
			 let rblxdata2 = await request({
			   uri: `https://users.roblox.com/v1/users/${data.primaryAccount}/username-history`,
			   json: true,
			   simple: false
			 });

        let pastNames = ''
        try {
          const pastNamesData = await request({
            uri: `https://users.roblox.com/v1/users/${data.primaryAccount}/username-history?limit=50&sortOrder=Desc`,
            json: true,
            simple: false
          })
          pastNamesData.data.forEach(oldname => { pastNames += `, ${oldname.name}` })
          if (pastNames) pastNames = pastNames.replace(', ', '')
        } catch (e) {}

        let mainm = msgObject.mentions.members.first();

        let iembed = new MessageEmbed()
        .setColor("RANDOM")
       .setTitle(`Discord Status`)
       .setThumbnail(argUser.avatarURL())
       .addField("Username:", argUser.username, true)
       .addField("Tag:", argUser.tag, true)
       .addField("ID:", argUser.id, true)
       .addField("Created:", argUser.createdAt);
       iembed.setFooter("Powered by SolarTech", "https://cdn.discordapp.com/avatars/681375746920284161/0dfd31817fd8cdd3a4a3e89f2d6ec6cd.webp?size=128")
       msgObject.channel.send(iembed);

        let me = {}
        try {
          me = await request({
            uri: `https://users.roblox.com/v1/users/${data.primaryAccount}`,
            json: true,
            simple: false
          })
        } catch (e) {}

        if (me.name) {
          robloxUsername = me.name
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
			embed.addField('ID:', data.primaryAccount, true)
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
			 embed.setFooter("Powered By SolarTech", "https://cdn.discordapp.com/avatars/681375746920284161/0dfd31817fd8cdd3a4a3e89f2d6ec6cd.webp?size=128");


			 editMsg.edit(embed);
	  }
  }
}
