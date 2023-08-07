const {google} = require('googleapis');
const sheets = google.sheets('v4');

async function getLastRow(spreadsheetId, sheetName) {
    console.group('read.js getLastRow() 開始執行');
    console.table({
        spreadsheetId: spreadsheetId,
        sheetName: sheetName
    });
    console.info('read.js 呼叫 authorize()');
    const auth = await authorize();
    console.info('read.js 完成 authorize()');
    const request = {
        spreadsheetId: spreadsheetId,
        range: `${sheetName}!A:A`,
        auth: auth
    };

    const response = await sheets.spreadsheets.values.get(request);
    console.info('getLastRow response.data.values.length: ' + response.data.values.length);

    console.groupEnd('read.js getLastRow() 執行完畢');
    return response.data.values.length;
}

async function authorize() {
    const jwtClient = new google.auth.JWT(
        process.env.GOOGLE_CLIENT_EMAIL,
        null,
        process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        ['https://www.googleapis.com/auth/spreadsheets']
    );

    await jwtClient.authorize();
    console.log('authorize finish in read.js');
    return jwtClient;
}

module.exports = {
    getLastRow
};
