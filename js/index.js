const key = "55eadf53dac24be2803a0bec1daa6596";

let schoolName;
let local;
let searchResult = document.querySelector('#search-result');
const HIDDEN_CLASSNAME = "hidden";

document.querySelector('.school-name').addEventListener('input', (event) => {
  schoolName = event.target.value;
});

document.querySelector('.optionList').addEventListener('change', (event) => {
  local = event.target.value;
});

let resultBar = document.createElement("div");
resultBar.classList.add("resultBar");

function search() {
    searchResult.classList.remove(HIDDEN_CLASSNAME);
    let url = `https://open.neis.go.kr/hub/schoolInfo?key=${key}&Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${local}&SCHUL_NM=${schoolName}`;
    jsonData(url, searchResult);
}

async function jsonData(url, objField) {
    try {
        const result = await fetch(url);
        const jsonData = await result.json();

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
        console.error('Error fetching or parsing data:', error);
    }
}

function formatSchoolInfo(school) {
    let container = document.createElement('div');
    container.classList.add('school-info');

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

async function result() {
    let url;
    if (key && schoolName && local) {
        url = `https://open.neis.go.kr/hub/schoolInfo?key=${key}&Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${local}&SCHUL_NM=${schoolName}`;
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
        console.error('Error fetching or parsing data:', error);
    }
}
