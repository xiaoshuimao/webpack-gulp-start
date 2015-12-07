let Func = {
  // 截取url参数
  getQuery: (name) => {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },
  isWx: (() => {
    let ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      return true;
    } else {
      return false;
    }
  })(),
  formatTime: (time) => {
    var leftsecond = parseInt(time / 1000);
    var day = Math.floor(leftsecond / (60 * 60 * 24));
    var hour = Math.floor((leftsecond - day * 24 * 60 * 60) / 3600);
    var minute = Math.floor((leftsecond - day * 24 * 60 * 60 - hour * 3600) / 60);
    var second = Math.floor(leftsecond - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
    return {
      d: day,
      h: hour,
      m: minute,
      s: second
    }
  },
  cookie: {
    set: (name, value, day) => {
      var exp = new Date();
      exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
      document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    get: (name) => {
      var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
      } else { return null; }
    },
    del: (name) => {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval = getCookie(name);
      if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
  },
  addjs:  (url, callback, async = true) => {
    let js = document.createElement('script');
    js.type = 'text/javascript';
    js.async = async;
    js.src = url;
    js.onload = () => {
      callback();
    }
    document.body.appendChild(js);
  },
  smq:(function() {
		window._smq = window._smq || [];
		window._smq.push(['_setAccount', '2719b1e', new Date()]);
		window._smq.push(['pageview']);
		var sm = document.createElement('script');
    sm.type = 'text/javascript'; sm.async = true;
		sm.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdnmaster.com/sitemaster/collect.js';
		var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(sm, s);
    
		window._hmt = window._hmt || [];
		var hm = document.createElement("script");
		hm.src = "//hm.baidu.com/hm.js?98c9fb8d45901b610138343b850460d7";
		var s2 = document.getElementsByTagName("script")[0];
		s2.parentNode.insertBefore(hm, s2);
  })()
}


module.exports = Func;