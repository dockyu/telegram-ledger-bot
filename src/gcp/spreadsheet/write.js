const {google} = require('googleapis');
const sheets = google.sheets('v4');

async function updateOneCell(spreadsheetId, sheetName, row, column, data) {
    console.group('write.js updateOneCell() 開始執行');
    console.table({
        spreadsheetId: spreadsheetId,
        sheetName: sheetName,
        row: row,
        column: column,
        data: data
    });
    console.info('write.js 呼叫 authorize()');
    const auth = await authorize();
    console.info('write.js 完成 authorize()');

    const range = `${sheetName}!${column}${row}`;
    const request = {
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: 'RAW',
        resource: {
            values: [[data]]
        },
        auth: auth
    };

    await sheets.spreadsheets.values.update(request);

    console.groupEnd('write.js updateOneCell() 執行完畢');
    return;
}

async function authorize() {
    const jwtClient = new google.auth.JWT(
        process.env.GOOGLE_CLIENT_EMAIL,
        null,
        process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        ['https://www.googleapis.com/auth/spreadsheets']
    );

    await jwtClient.authorize();
    return jwtClient;
}

module.exports = {
    updateOneCell
};
