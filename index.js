const config = require("./config.json");
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const streamOptions = { seek: 0, volume: 1 };

const bot = new Discord.Client({disableEveryone: true});

var servers = {};

const errors = ["잘못된 구문입니다. //help를 입력해서 명령어 목록을 확인하세요.", "필요한 파라미터 수보다 많거나, 적습니다.", "음성채널에 입장 후 실행해주세요."];

const cheerio = require('cheerio');
const request = require('request');
let url = "https://playentry.org/api/rankProject?type=staff&limit=3&noCache=1535458594330";
let pData = [];

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
      .setTitle("NYS Bot Commands")
      .setDescription("NYS Bot Commands")
      .setColor("#2478FF")
      .setThumbnail(hprofileIMG)
      .addField(`${prefix}help`, "도움말을 확인합니다.")
      .addField(`${prefix}info`, "니스봇의 정보를 확인합니다.")
      .addField(`${prefix}say <말할 것>`, "말할 것을 말합니다.")
      .addField(`${prefix}pick <첫번째 숫자> [두번째 숫자]`, "1부터 첫번째 숫자 중 하나의 숫자를 뽑거나 첫번째 숫자부터 두번째 숫자 중 하나의 숫자를 뽑습니다.")
      .addField(`${prefix}sp`, "엔트리 스태프 선정 작품을 실시간으로 확인합니다.")
      .addField(`${prefix}pp`, "엔트리 인기작품을 실시간으로 확인합니다.");
      return message.channel.send(hembed);
      break;

    case `${prefix}info`: //봇 정보
      let iprofileIMG = bot.user.displayAvatarURL;
      let iembed = new Discord.RichEmbed()
      .setTitle("NYS Bot Information")
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
    url = "https://playentry.org/api/rankProject?type=staff&limit=3";
    request(url, function(error, response, html){
    if (error) {throw error};
      const uObj = JSON.parse(html);
      pData = [];
      for (var i = 0; i < 3; i++) {
        pData.push({username: uObj[i].project.user.username,name: uObj[i].project.name,visit: uObj[i].project.visit,like: uObj[i].project.likeCnt,comment: uObj[i].project.comment, shortenUrl: uObj[i].project.shortenUrl});
      }
      let spembed = new Discord.RichEmbed()
      .setTitle("Entry Staff Picks")
      .setDescription("엔트리 실시간 스태프 선정 작품")
      .setColor("#2478FF")
      .addField(pData[0].name, `개발자 ${pData[0].username} | 조회수 ${pData[0].visit} | 좋아요 ${pData[0].like}개 | 댓글 ${pData[0].comment}개 | [Click here](${pData[0].shortenUrl})`)
      .addField(pData[1].name, `개발자 ${pData[1].username} | 조회수 ${pData[1].visit} | 좋아요 ${pData[1].like}개 | 댓글 ${pData[1].comment}개 | [Click here](${pData[1].shortenUrl})`)
      .addField(pData[2].name, `개발자 ${pData[2].username} | 조회수 ${pData[2].visit} | 좋아요 ${pData[2].like}개 | 댓글 ${pData[2].comment}개 | [Click here](${pData[2].shortenUrl})`);
      return message.channel.send(spembed);
    });
    break;

    case `${prefix}pp`:
    url = "https://playentry.org/api/rankProject?type=best&limit=9";
    request(url, function(error, response, html){
    if (error) {throw error};
      const pObj = JSON.parse(html);
      pData = [];
      for (var j = 0; j < 9; j++) {
        pData.push({username: pObj[j].project.user.username,name: pObj[j].project.name,visit: pObj[j].project.visit,like: pObj[j].project.likeCnt,comment: pObj[j].project.comment, shortenUrl: pObj[j].project.shortenUrl});
      }
      let ppembed = new Discord.RichEmbed()
      .setTitle("Entry Popular Projects")
      .setDescription("엔트리 실시간 인기작품")
      .setColor("#2478FF")
      .addField(pData[0].name, `개발자 ${pData[0].username} | 조회수 ${pData[0].visit} | 좋아요 ${pData[0].like}개 | 댓글 ${pData[0].comment}개 | [Click here](${pData[0].shortenUrl})`)
      .addField(pData[1].name, `개발자 ${pData[1].username} | 조회수 ${pData[1].visit} | 좋아요 ${pData[1].like}개 | 댓글 ${pData[1].comment}개 | [Click here](${pData[1].shortenUrl})`)
      .addField(pData[2].name, `개발자 ${pData[2].username} | 조회수 ${pData[2].visit} | 좋아요 ${pData[2].like}개 | 댓글 ${pData[2].comment}개 | [Click here](${pData[2].shortenUrl})`)
      .addField(pData[3].name, `개발자 ${pData[3].username} | 조회수 ${pData[3].visit} | 좋아요 ${pData[3].like}개 | 댓글 ${pData[3].comment}개 | [Click here](${pData[3].shortenUrl})`)
      .addField(pData[4].name, `개발자 ${pData[4].username} | 조회수 ${pData[4].visit} | 좋아요 ${pData[4].like}개 | 댓글 ${pData[4].comment}개 | [Click here](${pData[4].shortenUrl})`)
      .addField(pData[5].name, `개발자 ${pData[5].username} | 조회수 ${pData[5].visit} | 좋아요 ${pData[5].like}개 | 댓글 ${pData[5].comment}개 | [Click here](${pData[5].shortenUrl})`)
      .addField(pData[6].name, `개발자 ${pData[6].username} | 조회수 ${pData[6].visit} | 좋아요 ${pData[6].like}개 | 댓글 ${pData[6].comment}개 | [Click here](${pData[6].shortenUrl})`)
      .addField(pData[7].name, `개발자 ${pData[7].username} | 조회수 ${pData[7].visit} | 좋아요 ${pData[7].like}개 | 댓글 ${pData[7].comment}개 | [Click here](${pData[7].shortenUrl})`)
      .addField(pData[8].name, `개발자 ${pData[8].username} | 조회수 ${pData[8].visit} | 좋아요 ${pData[8].like}개 | 댓글 ${pData[8].comment}개 | [Click here](${pData[8].shortenUrl})`);
      return message.channel.send(ppembed);
    });
    break;

    case `${prefix}play`: //음악 재생 명령어
      //if(!messageArray[1]) {
        //errorPrint(2); //파라미터를 입력해주세요
        //return;
      //}

      if(!message.member.voiceChannel) {
        errorPrint(3); //음성채널에 입장해주세요
        return;
      }

      message.member.voiceChannel.join()
      .then(connection => {
        const stream = ytdl('https://www.youtube.com/watch?v=aiHSVQy9xN8', { filter : 'audioonly' });
        const dispatcher = connection.playStream(stream, streamOptions);
        })
          .catch(console.error);

      break;

    default: //구문이 잘못된 경우
      errorPrint(0);
  }

  function errorPrint(num) {
    return message.channel.send(mention + "```" + errors[num] + "```");
  }

  function play(connection, message) {
    let server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
      if(server.queue[0]) play(connection, message);
      else connection.disconnect();
    });
  }

});

bot.login(config.token);
