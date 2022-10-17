// 특정 path 아래에 있는 모든 파일을 확인할 수 있어야 함.

// 우선 특정 디렉토리 예하에 있는 모든 파일을 다 탐색해야 함

// 스크립트 내 확인하고싶은 파일의 확장자를 미리 정해서 작성한 후 스크립트를 돌릴 수 있어야 함

// (optional) 추출할 언어에 대한 코드 값을 설정후 스크립트를 돌릴 수 있음
//    - 지금 다시 생각해보니 언어 상관 없이 문자열 값이면 추출하는게 맞는 것 같다는 생각이 든다
//      (∵ 영어로만 display 되는 문자열 일 수도 있음)

// 그리고 탐색시 지정한 확장자의 파일만 파일 내용을 검사해야 함

/**
 * 지정한 파일에서
 * - 디렉토리 위치
 * - 파일 명
 * - 파일 확장자
 * 정보를 가져와야 함
 */

// 원하는 파일을 찾으면 파일의 내용을 라인 바이 라인으로 탐색 ? 을 진행해야 함

// 소스코드 라인을 탐색할 때는 해당 라인에 대한 정보를 가져와야 함(N 번째 라인)


/**
 * 각 라인 별로 정규표현식을 사용하여 원하는 라인을 찾아가야 함
 *
 * - 행 주석 무시
 * - 멀티 라인 주석 무시
 * - "*" 로 시작하는 문자열도 무시해야 함(∵ 멀티라인 문자열)
 * - react 문자열인 경우..?
 */


// 그리고 라인 내용 중에(한글로 이루어진) 문자열을 뽑아내야 함

// 해당 파일, 라인 번호, 추출한(한글) 문자열