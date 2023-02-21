let updatebtn = document.querySelector('#updatebtn')

updatebtn?.addEventListener('click',()=>{
    let frm = document.updatefrm;
    if (frm.title.value === ''){alert('제목은?')}
    else if (frm.contents.value === ''){alert('제목은?')}
    else if (frm.userid.value !== ''){
        frm.method = 'post';
        frm.submit();
    }
});
