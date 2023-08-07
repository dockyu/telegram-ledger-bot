const TelegramBot = require('node-telegram-bot-api');
const AWS = require('aws-sdk');
const { getLastRow } = require('./gcp/spreadsheet/read');
const { updateOneCell } = require('./gcp/spreadsheet/write');


exports.handler = async (event) => {
    console.group('Lambda handler 開始執行');
    console.info('Lambda handler 收到的 event: ' + JSON.stringify(event));
    console.info('Lambda handler 呼叫 getParameters()');
    await getParameters();
    console.info('Lambda handler 完成 getParameters()');
    const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });
    console.info('bot 建立');

    const body = JSON.parse(event.body); // Telegram message data is in the body of the request
    const chatId = body.message.chat.id;
    const text = body.message.text;

    console.info('Lambda handler 收到訊息：' + text);

    const parts = text.split(' ');
    if (parts.length !== 2 || isNaN(parts[1])) {
        console.warn('錯誤：訊息格式不正確。請確保訊息是 "吃午餐 150" 這種格式，其中150是一個數字。');
        bot.sendMessage(chatId, '錯誤：訊息格式不正確。請確保訊息是 "吃午餐 150" 這種格式，其中150是一個數字。');
    } else {
        console.info('訊息格式正確！');
        const lastRow = await getLastRow(process.env.SPREADSHEET_ID, 'Sheet1');
        await updateOneCell(process.env.SPREADSHEET_ID, 'Sheet1', lastRow + 1, 'A', parts[0]);
        await updateOneCell(process.env.SPREADSHEET_ID, 'Sheet1', lastRow + 1, 'B', parts[1]);
        bot.sendMessage(chatId, text+' 已經記錄在 Google 試算表中。');
    }
    console.groupEnd('Lambda handler 執行完畢');
};

async function getParameters() {
    const ssm = new AWS.SSM();
    const params = {
        Names: [
            '/telegram-ledger-bot/GOOGLE_PRIVATE_KEY',
            '/telegram-ledger-bot/GOOGLE_CLIENT_EMAIL',
            '/telegram-ledger-bot/bot_token'
        ],
        WithDecryption: true
    };

    const response = await ssm.getParameters(params).promise();
    response.Parameters.forEach(parameter => {
        if (parameter.Name === '/telegram-ledger-bot/GOOGLE_PRIVATE_KEY') {
            process.env.GOOGLE_PRIVATE_KEY = parameter.Value;
        } else if (parameter.Name === '/telegram-ledger-bot/GOOGLE_CLIENT_EMAIL') {
            process.env.GOOGLE_CLIENT_EMAIL = parameter.Value;
        } else if (parameter.Name === '/telegram-ledger-bot/bot_token') {
            process.env.BOT_TOKEN = parameter.Value;
        }
    });

}