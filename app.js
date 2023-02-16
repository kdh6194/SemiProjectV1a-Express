// express 모듈과 기타 미들웨어 모듈 사용 선언
const express = require('express');
const path = require('path');
const logger = require('morgan');

// 라우팅 설정 모듈화
const indexRouter = require('./routes/index');
const memberRouter = require('./routes/member');
const boardRouter = require('./routes/board');

// express 객체 생성 및 포트 변수 선언
const app = express();
const port = process.env.PORT || 3000;

//라우팅 없이 바로 호출 가능하도록 static 폴더 설정
app.use(express.static(path.join(__dirname,'static')));

// 라우팅 모듈 등록 - 클라이언트 요청 처리 핵심 파트
app.use('/',indexRouter);
app.use('/',memberRouter);
app.use('/',boardRouter);

// 기타 라우팅 처리 - 404 응답코드
app.use((req,res)=>{
    res.status(404);
    res.send('404-페이지가 없습니다.');
});
// 기타 라우팅 처리 - 500 응답코드
app.use((err,req,res,next)=>{
    res.status(500);
    res.send('500-서부 내부 오류가 발생했습니다.');
});

// 위에서 설정한 사항을 토대로 express 서버 실행
app.listen(port,()=>{
    console.log('SemiProjectV1 서버 실행중...');
})
