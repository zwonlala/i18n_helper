import dotenv from 'dotenv';
import { GoogleSpreadsheet } from 'google-spreadsheet';

dotenv.config({ path: '.env' });

async function loadDocument() {
    const doc = new GoogleSpreadsheet(process.env.SPREAD_SHEET_DOC_ID);

    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY
    });

    await doc.loadInfo();
    return doc;
}

async function addRow(sheet, extension, name, location, content, line, korString) {
    const row = {
        '파일 확장자': extension,
        '파일 명': name,
        '파일 위치': location,
        '파일 내용': content,
        '라인': line,
        '한글 포함 문자열': korString
    };

    const newRow = await sheet.addRow(row);
    await newRow.save();
}

async function upload(fileDataList) {
    const document = await loadDocument();
    const sheet = document.sheetsById[process.env.SPREAD_SHEET_ID];

    await sheet.clearRows();

    for (const fileData of fileDataList) {
        const { extension, name, location, content, line, korString } = fileData;
        await addRow(sheet, extension, name, location, content, line, korString);
    }

    console.log('끝');
}

await upload([
    {
        extension: 'ts',
        name: 'ReactDomView',
        location: 'src/editor/view/',
        content: '#include',
        line: '23',
        korString: '집에가고파'
    },
    {
        extension: 'tsx',
        name: 'ReactDomView2',
        location: 'src/editor/view/2',
        content: '#hi',
        line: '12',
        korString: '집에가고파22'
    }
])