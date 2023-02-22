let sido = document.querySelector('#sido');
let gugun = document.querySelector('#gugun');
let dong = document.querySelector('#dong');
let zipcode = document.querySelector('#zipcode');

let makeopt = (elm,text) => {
    let opt = document.createElement('option');
    let txt = document.createTextNode(text);
    opt.appendChild(txt);
    elm.appendChild(opt);
};
let makeAddr = (elm,text) => {
    let p = document.createElement('p');
    let txt = document.createTextNode(text);
    p.appendChild(txt);
    elm.appendChild(p);
};

const getSido = () => { // 서버에 시도 데이터 요청
    fetch('/zipcode2/sido').then(response => response.text()).then(text => setSido(text));
};

const setSido = (sidos) => {
    let objs = JSON.parse(sidos); // 문자열 => 객체로 바꿈

    while(sido.lastChild) {
        sido.removeChild(sido.lastChild)
    }

    makeopt(sido,'--시도--');

    objs.forEach((obj,idx)=>{
        makeopt(sido,obj.sido);
    })
};
getSido(); // 호출하기전에 에러가 발생하여 값을 불러오지 못했다

const getGugun = () => {
    let qry = '/'+sido.value

    fetch('/zipcode2/gugun'+qry).then(response => response.text()).then(text => setGugun(text));
};
const setGugun = (guguns) => {
    let objs = JSON.parse(guguns);

    while(gugun.lastChild) {
        gugun.removeChild(gugun.lastChild)
    }

    makeopt(gugun,'-시/구/군-');

    objs.forEach((obj,idx)=>{
        makeopt(gugun,obj.gugun)
    })
};
sido.addEventListener('change',getGugun)
const getDong = () => {
    let qry = '/'+sido.value +'/'+ gugun.value

    fetch('/zipcode2/dong'+qry).then(response => response.text()).then(text => setDong(text));
};
const setDong = (dongs) => {
    let objs = JSON.parse(dongs);

    while(dong.lastChild) {
        dong.removeChild(dong.lastChild)
    }

    makeopt(dong,'-읍/면/동-');

    objs.forEach((obj,idx)=>{
        makeopt(dong,obj.dong)
    })

};
gugun.addEventListener('change',getDong)
const getZip = () => {
    let qry = '/'+sido.value +'/'+ gugun.value + '/'+ dong.value

    fetch('/zipcode2/zip'+qry).then(response => response.text()).then(text => setZipcode(text));

    // let result = ` 선택한 주소 : ${sido.value} ${gugun.value} ${dong.value} `;
    // if(dong.value == '-읍/면/동-') {return;}
    // zipcode.innerHTML = result  --> 고시대 유물이다

};// 리,번지는 데이터를 불러오지 않았기때문에 값을 받아오는것을 해야한다.
const setZipcode = (zips) => {
    let objs = JSON.parse(zips);

    while(zipcode.lastChild) {
        zipcode.removeChild(zipcode.lastChild)
    }

    objs.forEach((obj,idx)=>{
        let addr = `${obj.zipcode} : ${obj.sido} ${obj.gugun} ${obj.dong} ${obj.ri} ${obj.bunji}`;
        makeAddr(zipcode,addr)
    })

};
dong.addEventListener('change',getZip)
// 처음 getSido를 제외하고는 이벤트리스너를 통해 동작한다.
// fetch안에 적는 주소는 ex) /zipcode2/dong 라면 /변수1.값/변수2.값 으로 작성되게끔
// 변수.value라고 적으면 된다.그리고 한번 불러온건 계속 남기때문에 지우는것도 해야함
// while(dong.lastChild) {dong.removeChild(dong.lastChild)} 이구문이 한번썻던것을 지우는역할
// 중간에 -시구군-이나 -시도- 를 클릭했을때 남는 경우가 있다
// if구문을 사용해가지고 -시도-,-시구군-를 선택하면 출력이 되지않게끔 만들어야한다
// 공백은 커밋이 되어야 하는데