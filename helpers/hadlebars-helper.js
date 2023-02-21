Helpers = {
    section: function(name, options) {
        if(!this._sections) this._sections = {}
        this._sections[name] = options.fn(this)
        return null
    },

    eq: function (a, b) {
        let result = false;
        if (a == b && a && b) { result = true;}
        return result;
    } // helper를 여러개를 사용해야한다면 위와 같이 만들면 된다?
};
// eq 문을 쓸때 잘 확인해야한다 (eq.session.userid list.[0].userid)
// 이렇게 쓰면 헬퍼가 동작하지 않는다
module.exports = Helpers;