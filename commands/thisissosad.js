module.exports = {
    name: 'thisissosad',
    description: 'This is so sad!',
    execute(message, args) {
    	if(args.length > 0){
			message.channel.send("ɴᴏᴡ ᴘʟᴀʏɪɴɢ: "+args.join(" ")+" ───────────⚪────── ◄◄ ▐▐ ►► 𝟸:𝟷𝟾 / 𝟹:𝟻𝟼   ───○ 🔊  ᴴᴰ ⚙️");
		}
		else{
			message.channel.send("ɴᴏᴡ ᴘʟᴀʏɪɴɢ: Despacito 2 ───────────⚪────── ◄◄ ▐▐ ►► 𝟸:𝟷𝟾 / 𝟹:𝟻𝟼   ───○ 🔊  ᴴᴰ ⚙️");
		}
    },
};