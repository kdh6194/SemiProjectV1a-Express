const postin = () => {
    let frm = document.writefrm;
    if (frm.title.value === '') {alert('제목을 입력하셔야 됩니다')}
    else if (frm.contents.value === '') {alert('내용을 입력하셔야 됩니다')}
    else if (frm.userid.value !== '') {
        frm.method = 'post';
        frm.submit();
    }

};
let writebtn = document.querySelector('#writebtn');
writebtn.addEventListener('click',postin);