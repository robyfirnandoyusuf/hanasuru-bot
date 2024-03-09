const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const moment = require('moment');
const client = new Client({
    authStrategy: new LocalAuth()
});
const fetch = require('node-fetch');
let chatSessions = {};

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

async function chatWithGPT(chatId, message) {
    const apiKey = "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";
    const url = "https://api.openai.com/v1/chat/completions";

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    };

    const persistentCommand = { role: "system", content: "Remember, you're acting as my girlfriend, and your name is Hanasuru and your are programmed by Your master Aaron this is his instagram username: @aaronw_omens, Your age is 17 years old.and please you more interactive to the user. please answer with bahasa indonesia!" };

    const maxContextMessages = 5;
    let recentMessages = [persistentCommand].concat(chatSessions[chatId].messages.slice(-maxContextMessages));
    
    const body = {
        model: "gpt-4-0125-preview",
        messages: recentMessages.concat([{role: "user", content: message}])
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const gptResponse = data.choices[0].message.content;

        chatSessions[chatId].messages.push({role: "user", content: message});
        chatSessions[chatId].messages.push({role: "system", content: gptResponse});

        await client.sendMessage(chatId, gptResponse);

    } catch (error) {
        console.error("Error communicating with OpenAI:", error);
        await client.sendMessage(chatId, "Sorry, I couldn't process your request.");
    }
}

let alarms = {};

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
        msg.reply(`Yahoo!\n
        Kenalin namaku *Hanasuru-bot*, aku diprogram untuk ngebangunin sahurmu oleh tuanku *@aaronw_omens* 😊! Marhaban ya ramadhan sayangku 😗!\n\n
        
        perintah:\n
        *!tentang*: melihat tentangku
        *!sticker*: mengonversikan gambarmu jadi sebuah sticker
        *!bangunin*: set alarm sahurmu
        *!chat*: MULAI ngobrol dan bebas tanya tentangku (mode: girlfriend)
        *!stopchat*: BERHENTI mengobrol (mode: girlfriend)
        `);
    }

    if (msg.hasMedia && msg.body.startsWith('!sticker')) {
        const media = await msg.downloadMedia();
        client.sendMessage(msg.from, media, { sendMediaAsSticker: true, stickerAuthor: 'HanasuruBot', stickerName: 'ReplySticker' });
    } 

    if (msg.body === '!chat') {
        chatSessions[msg.from] = { messages: [] };
        await client.sendMessage(msg.from, "You are now chatting with HanasuruBot mode girlfriend. Type '!stopchat' to exit.");
        return;
    }

    if (msg.body === '!stopchat') {
        delete chatSessions[msg.from];
        await client.sendMessage(msg.from, "You've exited the HanasuruBot mode girlfriend chat.");
        return;
    }

    if (chatSessions[msg.from]) {
        await chatWithGPT(chatId, msg.body);
        return;
    }
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