import * as fs from 'fs';
import { extname } from 'path';

//[x] 특정 path 아래에 있는 모든 파일을 확인할 수 있어야 함.
const PATH = '/Users/jiwonsong/Documents/miricanvas-web/src';
// const EXT_LIST = ['.ts', '.tsx'];
const EXT_LIST = ['.ejs'];

// 라인 주석 정규표현식
const REGEXP_COMMENT_LINE = new RegExp(/\/\/.*/, 'gm');

// 멀티 라인 주석 정규표현식
const REGEXP_COMMENT_MULTI_LINE = new RegExp(/\/\*([\s\S]*?)\*\//, 'g');

/**
 * `<div id="sports">축구</div>` 와 같은 문자열에서 "축구"라는 문자열만 추출하는 정규표현식
 * 
 * < : < 문자에 매치
 * \/ : 슬래시 문자
 * ? : 슬래시가 없거나 하나만 매치
 * [^>] : '> 이외의 문자'에 매치
 * + : 위 '> 이외의 문자'를 연속해서 매치
 * > : '>' 문자에 매치
 */
const REGEXP_INNER_TEXT = new RegExp('<\/?[^>]+>', 'igm');

/**
 * <body> </body> tag안의 innerText 값만 추출하는 정규표현식
 * TODO: 닫는 태그('>')를 작성하면 정규표현식이 정상적으로 동작하지 않음...! => 나중에 이유 찾아보기!
 * 
 * <body : '<body' 문자열에 매치
 * [\s|\s] : 보이는 문자 | 보이지 않는 문자에 매치
 * * : 위 '보이는 문자 | 보이지 않는 문자' 0회 이상 매치
 * <\/body : '</body' 문자열에 매치
 */
 const REGEXP_BODY_TAG_INNER_TEXT = /<body[\S|\s]*<\/body/igm;

// For TEST
const DEBUG = false;

//[x] 우선 특정 디렉토리 예하에 있는 모든 파일을 다 탐색해야 함
/**
 * 특정 path 아래 존재하는 모든 파일 목록들을 출력하는 함수
 * @param {string} path 파일 목록들을 확인하려고 하는 directory 경로
 */
function printAllFiles(path) {
    const files = fs.readdirSync(path, { withFileTypes: true });

    files.forEach(file => {

        if (file.isFile() || !file.isDirectory()) {
            if (!isTypeScriptBasedFile(file)) {
                return;
            }

            /**
             * [x] 지정한 파일에서
             * - 디렉토리 위치
             * - 파일 명
             * - 파일 확장자
             * 정보를 가져와야 함
             */
            console.log(
                `\x1b[1m${extname(file.name).substring(1)}\x1b[0m`,
                `\x1b[33m${file.name}\x1b[0m`,
                `\x1b[4m${path}\x1b[0m`);
            readFile(`${path}/${file.name}`);
            return;
        }
        printAllFiles(`${path}/${file.name}`);
    });
}

printAllFiles(PATH);


//[x] 스크립트 내 확인하고싶은 파일의 확장자를 미리 정해서 작성한 후 스크립트를 돌릴 수 있어야 함
/**
 * 타입스크립트 기반 파일인지 판단하는 함수.
 * 입력받은 파일의 확장자 값이 EXT_LIST 배열내 존재하면 true 값 리턴
 * @param {fs.Dirent} file 파일 확장자를 검사할 파일
 */
function isTypeScriptBasedFile(file) {
    const extension = extname(file.name);
    return EXT_LIST.includes(extension);
}

// (optional) 추출할 언어에 대한 코드 값을 설정후 스크립트를 돌릴 수 있음
//    - 지금 다시 생각해보니 언어 상관 없이 문자열 값이면 추출하는게 맞는 것 같다는 생각이 든다
//      (∵ 영어로만 display 되는 문자열 일 수도 있음)

//[x] 그리고 탐색시 지정한 확장자의 파일만 파일 내용을 검사해야 함
/**
 * 입력받은 path에 해당하는 파일을 read 하여
 * 주석을 제거한 파일 부분만을
 * 라인 별로 나누어 배열로 리턴하는 함수
 * @param {string} path 해당 파일 path
 */
function getFileLineListExceptComment(path) {
    try {
        const data = fs.readFileSync(path, { encoding: 'utf-8' });

        const isFileHasComment = hasComment(data);

        const commentFilteredData = isFileHasComment
            ? getCommentRemovedFileString(data)
            : data;

        return commentFilteredData.split('\n');;
    } catch (e) {
        console.log(e);
    }
}

// 원하는 파일을 찾으면 파일의 내용을 라인 바이 라인으로 탐색 ? 을 진행해야 함
// -> 생각해보니 주석을 제거하려면 라인 바이 라인이 아닌 전체 파일에서 주석을 제외(필터링)하고 남은 부분에 대해 문자열이 있는지 판단해야 함!

// 소스코드 라인을 탐색할 때는 해당 라인에 대한 정보를 가져와야 함(N 번째 라인)


/**
 * 각 라인 별로 정규표현식을 사용하여 원하는 라인을 찾아가야 함
 *
 * - 행 주석 무시
 * - 멀티 라인 주석 무시
 * - "*" 로 시작하는 문자열도 무시해야 함(∵ 멀티라인 문자열)
 * - react 문자열인 경우..?
 */


/**
 * 입력받은 File 문자열에 주석이 존재하는지 판단하는 함수
 * - 라인 주석 
 * - 멀티라인 주석
 * 모두 판단함.
 * @param {string} file 파일 내용에 주석이 존재하는지 확인할 파일 문자열
 * @returns {boolean} 파일에 주석이 존재한다면 true 값 리턴
 */
function hasComment(file) {
    const lineCommentList = file.match(REGEXP_COMMENT_LINE);
    const multiLineCommentList = file.match(REGEXP_COMMENT_MULTI_LINE);

    if (DEBUG) {
        console.log(lineCommentList);
        console.log(multiLineCommentList);
    }

    const hasLineComment = lineCommentList.length !== 0;
    const hasMultilineComment = multiLineCommentList?.length !== 0;

    return hasLineComment || hasMultilineComment;
}

/**
 * 입력받은 File 문자열에 존재하는 주석을 제거한 문자열을 리턴하는 함수
 * - 라인 주석 
 * - 멀티라인 주석
 * 모두 제거함
 * @param {string} file 주석을 제거할 파일 문자열
 * @returns {string} 주석이 제거된 파일 문자열
 */
function getCommentRemovedFileString(file) {
    return file
        .replace(REGEXP_COMMENT_LINE, '') // 라인 주석 제거
        .replace(REGEXP_COMMENT_MULTI_LINE, ''); // 멀티라인 주석 제거
}

/**
 * 입력받은 File 문자열에 존재하는 태그 사이의 innerText 문자열만 리턴하는 함수
 * @param {string} file innerText 값을 추출한 파일 문자열
 * @returns {string} tag 사이에 적용된 innerText 문자열들
 */
function getInnerTextString(file) {
    console.log(file);
    const bodyTagInnerText = file.match(REGEXP_BODY_TAG_INNER_TEXT);

    const x = bodyTagInnerText[0].replace(REGEXP_INNER_TEXT, '');
    console.log(`\x1b[33m${x}\x1b[0m`);
    return x;
}

// 그리고 라인 내용 중에(한글로 이루어진) 문자열을 뽑아내야 함

// 해당 파일, 라인 번호, 추출한(한글) 문자열