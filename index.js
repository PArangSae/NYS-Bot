const config = require("./config.json");
const Discord = require("discord.js");

const bot = new Discord.Client({disableEveryone: true});

const errors = ["잘못된 구문입니다. //help를 입력해서 명령어 목록을 확인하세요.", "필요한 파라미터 수보다 많거나, 적습니다."]

const cheerio = require('cheerio');
const request = require('request');
const url = "https://playentry.org/api/rankProject?type=staff&limit=3&noCache=1535458594330"

bot.on("ready", async () => {
  console.log(`${bot.user.username} ON!`);
  bot.user.setGame("//help");
});

bot.on("message", async message => {
  if(message.author.bot) return; //봇이 아닌 유저인 경우 체크
  if(message.channel.type === "dm") return;
  if(message.content.substring(0, 2) != config.prefix) return; //접두사가 맞는지 체크

  let prefix = config.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let mention = message.author;
  let allArgs = message.content.replace(cmd + " ", "");

  let d = new Date();

  console.log(`${message.author} used "${message.content}" - Time ${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`);

  switch (cmd) {
    case `${prefix}help`: //help
      let hprofileIMG = bot.user.displayAvatarURL;
      let hembed = new Discord.RichEmbed()
      .setDescription("NYS Bot Commands")
      .setColor("#2478FF")
      .setThumbnail(hprofileIMG)
      .addField(`${prefix}help`, "도움말을 확인합니다.")
      .addField(`${prefix}info`, "니스봇의 정보를 확인합니다.")
      .addField(`${prefix}say <말할 것>`, "말할 것을 말합니다.")
      .addField(`${prefix}pick <첫번째 숫자> [두번째 숫자]`, "1부터 첫번째 숫자 중 하나의 숫자를 뽑거나 첫번째 숫자부터 두번째 숫자 중 하나의 숫자를 뽑습니다.");
      return message.channel.send(hembed);
      break;

    case `${prefix}info`: //봇 정보
      let iprofileIMG = bot.user.displayAvatarURL;
      let iembed = new Discord.RichEmbed()
      .setDescription("NYS Bot Information")
      .setColor("#2478FF")
      .setThumbnail(iprofileIMG)
      .addField("Name", bot.user.username)
      .addField("Developer", "NYANGI")
      .addField("Development start date", bot.user.createdAt)
      .addField("Development Language", "Javascript")
      .addField("Hosting", "Heroku");
      return message.channel.send(iembed);
      break;

    case `${prefix}say`: //말하기
      if (messageArray.length > 0) {
        return message.channel.send(allArgs);
      }
      break;

    case `${prefix}pick`:
      if(messageArray.length < 4 || messageArray.length > 0) {
        if(messageArray.length == 2) {
          let num1 = parseInt(messageArray[1]);
          return message.channel.send(mention + " 1부터 " + num1 + "중 뽑힌 숫자 : " + (parseInt(Math.random()*num1) + 1));
        } else {
          let num2 = parseInt(messageArray[1]);
          let num3 = parseInt(messageArray[2]);
          return message.channel.send(mention + " " + num2 + "부터 " + num3 + "중 뽑힌 숫자 : " + (parseInt(Math.random()*num3 - num2) + num2));
        }
      } else {
        errorPrint(1);
      }
      break;

    case `${prefix}sp`:
    request(url, function(error, response, html){
    if (error) {throw error};
      const uObj = JSON.parse(html);
      //const uArr = Object.keys(uObj)
      //return message.channel.send(uObj.);
      console.log(html);
      return message.channel.send(html.replace(`%22`, `"`));
    });

    break;

    default: //구문이 잘못된 경우
      errorPrint(0);
  }


  function errorPrint(num) {
    return message.channel.send(mention + "```" + errors[num] + "```");
  }

});

bot.login(config.token);
