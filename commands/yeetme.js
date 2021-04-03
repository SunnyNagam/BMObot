module.exports = {
  name: 'yeet',
  description: 'deletes all messages from author (default), or from the tagged users',
  execute(message, args) {
    // remove my own messages if no tagged users
    const users = message.mentions.users.size === 0 ?
      new Set([message.author.id]) :
      new Set(message.mentions.users.keyArray());

    message.channel.send(`Yeeting...`).then(m=>m.delete(10000));

    let recurse; // some fanciness to make the interpreter happy
    let max = 15; // for safety
    const recurse_dlg = (messages) => {

      // if theres none here, exit (or max recursion because i dont know if my sort is gonna work)
      if (messages.size < 1 || !--max)
        return max ? message.channel.send(`Done!`).then(m => m.delete(10000)) : message.channel.send("Max recursion reached before deleting all (15 levels)");

      // grab the earliest one, so we can use it in the query later
      const oldestMessage = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp).first();

      // delete the ones we want to
      message.channel
        .bulkDelete(messages.filter(m => users.has(m.author.id)), true)
        .then(_ =>
          // recurse previous messages (before the earliest one in the collection)
          message.channel
            .fetchMessages({limit: 100, before: oldestMessage.id})
            .then(recurse)
        );
    };
    recurse = recurse_dlg;

    // recursively delete messages that are by any of the authors
    message.channel.fetchMessages({limit: 100}, false).then(recurse)
  }
};
