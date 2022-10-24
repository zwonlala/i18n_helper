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


// 따옴표 문자열 식별하는 정규표현식
const REGEXP_STRING_SINGLE = /'[\S| ]*'/gm;

// 쌍 따옴표 문자열 식별하는 정규표현식
const REGEXP_STRING_DOUBLE = /"[\S| ]*"/gm;

// 템플릿 리터럴 문자열 식별하는 정규표현식
const REGEXP_STRING_TEMPLATE = /`[\S| ]*`/gm;

const REGEXP_HAS_KOREAN = /[[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

export {
    REGEXP_COMMENT_LINE,
    REGEXP_COMMENT_MULTI_LINE,
    REGEXP_INNER_TEXT,
    REGEXP_BODY_TAG_INNER_TEXT,
    REGEXP_STRING_SINGLE,
    REGEXP_STRING_DOUBLE,
    REGEXP_STRING_TEMPLATE,
    REGEXP_HAS_KOREAN
};