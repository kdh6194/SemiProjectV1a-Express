const processlogin = () => {
    let frm = document.login;
    if (frm.userid.value === '') {alert('아이디를 입력하세요')}
    else if (frm.passwd.value === '') {alert('비밀번호를 입력하세요')}
    else {
        frm.method = 'post';
        frm.submit();
    }

};
let loginbtn = document.querySelector('#loginbtn');
loginbtn.addEventListener('click',processlogin);