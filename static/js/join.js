const processJoin = () => {
    let frm = document.joinfrm;
    if (frm.userid.value === '') {alert('아이디를 입력하세요')}
    else if (frm.passwd.value === '') {alert('비밀번호를 입력하세요')}
    else if (frm.name.value === '') {alert('이름을 입력하세요')}
    else if (frm.email.value === '') {alert('이메일을 입력하세요')}
    else {
        frm.method = 'post';
        frm.enctype = 'application/x-www-form-urlencoded';
        frm.submit();
        //그리고 위에 3개가 form관련된 메소드라 <form>으로 선택을 해야함
    }

};
let jobtn = document.querySelector('#joinbtn');
jobtn.addEventListener('click',processJoin);