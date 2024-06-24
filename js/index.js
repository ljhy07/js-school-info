const key = "55eadf53dac24be2803a0bec1daa6596";

let schoolName;
let local;
let searchResult = document.querySelector('#search-result');
let mealButton = document.querySelector('#cafeteria-button');
const HIDDEN_CLASSNAME = "hidden";
let schoolCode;

let year, month, day;
function getClock(){
    const date = new Date();
    year = String(date.getFullYear());
    month = String(date.getMonth()+1).padStart(2, "0");
    day = String(date.getDate()).padStart(2, "0");
}

document.querySelector('.school-name').addEventListener('input', (event) => {
  schoolName = event.target.value;
});

document.querySelector('.optionList').addEventListener('change', (event) => {
  local = event.target.value;
});

function search() {
    searchResult.classList.remove(HIDDEN_CLASSNAME);
    mealButton.classList.remove(HIDDEN_CLASSNAME);
    let url = `https://open.neis.go.kr/hub/schoolInfo?key=${key}&Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${local}&SCHUL_NM=${schoolName}`;
    jsonDataForInfo(url, searchResult);
}

async function jsonDataForInfo(url, objField) {
    try {
        const resultForInfo = await fetch(url);
        const jsonData = await resultForInfo.json();

        if (!jsonData['schoolInfo'] || jsonData['schoolInfo'].length < 1) {
            throw new Error('No data found');
        }

        let data = jsonData['schoolInfo'][1]['row'];

        // Clear previous results
        objField.innerHTML = '';

        // Process each school info and append to the objField
        data.forEach(school => {
            objField.appendChild(formatSchoolInfo(school));
        });
    } catch (error) {
        alert("입력이 잘못되었습니다.");
        console.error('Error fetching or parsing data:', error);
    }
}

function formatSchoolInfo(school) {
    let container = document.createElement('div');
    container.classList.add('school-info');
    
    schoolCode = school.SD_SCHUL_CODE;
    let fields = [
        { label: '교육청 코드', value: school.ATPT_OFCDC_SC_CODE },
        { label: '교육청 이름', value: school.ATPT_OFCDC_SC_NM },
        { label: '학교 코드', value: school.SD_SCHUL_CODE },
        { label: '학교 이름', value: school.SCHUL_NM },
        { label: '영문 학교 이름', value: school.ENG_SCHUL_NM },
        { label: '학교 종류', value: school.SCHUL_KND_SC_NM },
        { label: '지역', value: school.LCTN_SC_NM },
        { label: '교육 지원청', value: school.JU_ORG_NM },
        { label: '설립 구분', value: school.FOND_SC_NM },
        { label: '주소', value: `${school.ORG_RDNZC} ${school.ORG_RDNMA} ${school.ORG_RDNDA}` },
        { label: '전화번호', value: school.ORG_TELNO },
        { label: '홈페이지', value: school.HMPG_ADRES },
        { label: '성별', value: school.COEDU_SC_NM },
        { label: '팩스 번호', value: school.ORG_FAXNO },
        { label: '학교 특성', value: school.HS_SC_NM },
        { label: '특성화 여부', value: school.INDST_SPECL_CCCCL_EXST_YN },
        { label: '산업 관련 여부', value: school.HS_GNRL_BUSNS_SC_NM },
        { label: '특수 목적 학교 여부', value: school.SPCLY_PURPS_HS_ORD_NM },
        { label: '전기 여부', value: school.ENE_BFE_SEHF_SC_NM },
        { label: '주간 여부', value: school.DGHT_SC_NM },
        { label: '설립일', value: school.FOND_YMD },
        { label: '기념일', value: school.FOAS_MEMRD },
        { label: '데이터 갱신일', value: school.LOAD_DTM }
    ];

    fields.forEach(field => {
        let p = document.createElement('p');
        p.innerHTML = `<strong>${field.label}:</strong> ${field.value || 'N/A'}`;
        container.appendChild(p);
    });

    return container;
}

async function resultForInfo() {
    let url;
    if (key && schoolName && local) {
        url = `https://open.neis.go.kr/hub/mealServiceDietInfo?key=${key}&Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${local}&SD_SCHUL_CODE=${schoolCode}&MLSV_YMD=${year+month+day}`;
    } else {
        alert("입력칸을 모두 채워주세요.");
        return;
    }

    try {
        const result = await fetch(url);
        const jsonData = await result.json();

        if (!jsonData['schoolInfo'] || jsonData['schoolInfo'].length < 1) {
            throw new Error('No data found');
        }

        let data = jsonData['schoolInfo'][1]['row'];

        console.log(data);

        // Display the result in the searchResult element
        searchResult.innerHTML = '';

        // Process each school info and append to the searchResult
        data.forEach(school => {
            let schoolInfo = formatSchoolInfo(school);
            searchResult.appendChild(schoolInfo);
        });

        return data;
    } catch (error) {
        alert("입력이 잘못되었습니다.");
        console.error('Error fetching or parsing data:', error);
    }
}

function cafeteriaSearch() {
    let url = `https://open.neis.go.kr/hub/mealServiceDietInfo?key=${key}&Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${local}&SD_SCHUL_CODE=${schoolCode}&MLSV_YMD=${year+month+day}`;
    jsonDataForMeal(url, searchResult);
}

async function jsonDataForMeal(url, objField) {
    try {
        const resultForInfo = await fetch(url);
        const jsonData = await resultForInfo.json();

        if (!jsonData['mealServiceDietInfo'] || jsonData['mealServiceDietInfo'].length < 1) {
            throw new Error('No data found');
        }

        let data = jsonData['mealServiceDietInfo'][1]['row'];

        // Clear previous results
        objField.innerHTML = '';

        // Process each meal info and append to the objField
        data.forEach(meal => {
            objField.appendChild(formatSchoolMeal(meal));
        });
    } catch (error) {
        alert("입력이 잘못되었습니다.");
        console.error('Error fetching or parsing data:', error);
    }
}

function formatSchoolMeal(meal) {
    let container = document.createElement('div');
    container.classList.add('meal-info');

    let fields = [
        { label: '교육청 코드', value: meal.ATPT_OFCDC_SC_CODE },
        { label: '교육청 이름', value: meal.ATPT_OFCDC_SC_NM },
        { label: '학교 코드', value: meal.SD_SCHUL_CODE },
        { label: '학교 이름', value: meal.SCHUL_NM },
        { label: '급식 코드', value: meal.MMEAL_SC_CODE },
        { label: '급식 종류', value: meal.MMEAL_SC_NM },
        { label: '급식 일자', value: meal.MLSV_YMD },
        { label: '식사 인원', value: meal.MLSV_FGR },
        { label: '메뉴', value: meal.DDISH_NM },
        { label: '원산지 정보', value: meal.ORPLC_INFO },
        { label: '칼로리 정보', value: meal.CAL_INFO },
        { label: '영양 정보', value: meal.NTR_INFO },
        { label: '시작 일자', value: meal.MLSV_FROM_YMD },
        { label: '종료 일자', value: meal.MLSV_TO_YMD },
        { label: '데이터 갱신일', value: meal.LOAD_DTM }
    ];

    fields.forEach(field => {
        let p = document.createElement('p');
        p.innerHTML = `<strong>${field.label}:</strong> ${field.value || 'N/A'}`;
        container.appendChild(p);
    });

    return container;
}

mealButton.addEventListener('click', cafeteriaSearch);
setInterval(getClock, 1000);