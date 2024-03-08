const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const moment = require('moment');
const client = new Client({
    authStrategy: new LocalAuth()
});
/* const openai = require('openai');

openai.apiKey = "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";
let chatSessions = {}; */

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

/* async function chatWithGPT(message) {
    
    return `Response from GPT: ${message}`;
} */

let alarms = {};
// let chatGPTSessions = {};

client.on('message', async msg => {
    const chatId = msg.from;

    if (msg.body.startsWith('!bangunin ')) {
        const time = msg.body.split(' ')[1];
        if (!/^\d{2}:\d{2}$/.test(time)) {
            msg.reply("Please use the correct format: !bangunin HH:MM");
            return;
        }

        const currentTime = moment();
        const alarmTime = moment(time, "HH:mm");

        if (alarmTime <= currentTime) {
            alarmTime.add(1, 'days');
        }

        const delay = alarmTime.diff(currentTime);

        setTimeout(() => {
            const chatId = msg.from;
            const alarmMsg = `🔔 SAHURR SAHURR SAYANG! BANGUN IH UDAH PUKUL ${alarmTime.format("HH:mm")} NIHHHH 😠!!!!`;
            sendPeriodicMessage(chatId, alarmMsg);

        }, delay);

        msg.reply(`Oke sayang, aku akan bangunin kamu pukul ${alarmTime.format("HH:mm")} yah !. Selamat tidur, semoga mimpi indah 😊`);
    }

    if (msg.body.startsWith('!tentang')) {
        msg.reply(`Yahoo!\nKenalin namaku Hanasuru-bot, aku diprogram untuk ngebangunin sahurmu oleh tuanku @aaronw_omens 😊! Marhaban ya ramadhan sayangku 😗!`);
    }

    if (msg.hasMedia && msg.body.startsWith('!sticker')) {
        const media = await msg.downloadMedia();
        client.sendMessage(msg.from, media, { sendMediaAsSticker: true, stickerAuthor: 'HanasuruBot', stickerName: 'ReplySticker' });
    } 

    /* if (msg.body === '!chat') {
        chatSessions[msg.from] = { messages: [] };
        await client.sendMessage(msg.from, "You are now chatting with ChatGPT. Type '!stopchat' to exit.");
        return;
    }

    if (msg.body === '!stopchat') {
        delete chatSessions[msg.from];
        await client.sendMessage(msg.from, "You've exited the ChatGPT chat.");
        return;
    }

    if (chatSessions[msg.from]) {
        try {
            const chatSession = chatSessions[msg.from];
            // Add user's message to session
            chatSession.messages.push({ role: "user", content: msg.body });

            // Call OpenAI API
            const response = await openai.createCompletion({
                model: "gpt-3.5-turbo", // Use the latest model available
                messages: chatSession.messages,
            });

            // Add GPT's response to session
            const gptResponse = response.data.choices[0].message.content;
            chatSession.messages.push({ role: "system", content: gptResponse });

            // Send GPT's response back to the user
            await client.sendMessage(msg.from, gptResponse);
        } catch (error) {
            console.error("Error communicating with OpenAI:", error);
            await client.sendMessage(msg.from, "Sorry, I couldn't process your request.");
        }
    } */
});

async function sendPeriodicMessage(chatId, message) {
    let messageSent = await client.sendMessage(chatId, message);
    let attempts = 0;
    const maxAttempts = 10; 
    const checkInterval = 5000;

    const intervalId = setInterval(async () => {
        attempts++;
        if (attempts >= maxAttempts) {
            clearInterval(intervalId);
        } else {
            await client.sendMessage(chatId, message + ` (Reminder #${attempts})`);
        }
    }, checkInterval);
}

client.initialize();