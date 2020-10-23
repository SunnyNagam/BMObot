var request = require("request");
var scheduler = require("node-schedule");

let currentSchedule;

module.exports = {
  name: 'memes',
  description: `
    Asks memebot for memes: 
    !memes every 5 minutes forever
    !memes every friday until 2020-11-11
    !memes stop
  `,
  execute(message, args) {
    let i = 0;
    let token = '';
    let failed = false;
    const err = (m) => (failed = true, message.channel.send(m || "I don't know what to do"));
    const cap = (n, low, high) => Math.min(Math.max(n, low), high);
    const nextToken = () => {
      if (i >= args.length) return err(), false;
      return token = args[i++].toLowerCase(), true;
    }
    let cron = '';
    let end;

    while (i < args.length) {
      nextToken();
      switch (token.toLowerCase()) {
        case "stop":
          if (currentSchedule)
            currentSchedule.cancel();
          currentSchedule = undefined;
          err('Stopping!');
          break;
        case "every":
          if (nextToken()) {
            let numOrNot = parseInt(token);
            let num = 1;
            if (!isNaN(numOrNot)) {
              num = numOrNot;
              if (!nextToken()) break;
            } else if (token == 'half') {
              if (!nextToken()) break;
            }
            // token is hour | minute | second
            // cron looks like "s m h d m w"
            let num = 1;
            switch (token) {
              case "min":
              case "minute":
              case "minutes":
                num = cap(num, 1, 59);
                cron = `*/${num} * * * *`;
                break;
              case "h":
              case "hour":
              case "hours":
                num = cap(num, 1, 23);
                cron = `* */${num} * * *`;
                break;
              case "day":
              case "days":
                num = cap(num, 1, 31);
                cron = `* * */${num} * *`;
                break;
              default:
                let dayprefix = token.substr(0,3)
                let dow = ['sun','mon','tue','wed','thu','fri','sat'].findIndex( e => e === dayprefix);
                if (dow !== -1) cron = `* * * * * ${num}`;
                else err('Every *What*?')
            }
          }
          break;
        case "cron": 
          if (nextToken()) cron = token;
          break;
        case "until":
          if (nextToken()) end = new Date(token);
          break;
        case "forever":
          end = -1;
          break;
        default:
          err();
      }
      if (failed) break;
    }

    const rule = { rule: cron };
    if (end !== -1) obj.end = end;

    message.reply(`Looks like you want memes on this schedule: ${cron}`);

    scheduler.scheduleJob(rule, function(){
      message.channel
        .send("pls meme")
        .then (myMessage => myMessage({timeout: 10000})); // delete this message after 10 seconds
    });

  },
};