function getCookie(name)
{
    var dc = document.cookie;
    var prefix = name + "=";

    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {

        begin = dc.indexOf(prefix);
        if (begin != 0) return null;

    } else {

        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) end = dc.length;
    }

    return decodeURI(dc.substring(begin + prefix.length, end));
} 

function setCookie(name, value, expires, reloadIfNotSet = false, path = "/")
{
    var reload = false;
    if (!(expires instanceof Date)) {

        switch(typeof expires) {

            case "string":
                expires = new Date(expires);
                break;

            default:
                date = new Date();
                date.setTime(date.getTime() + Number(expires) * 1000);
                expires = date;
        }
    }

    // Already came here..
    var cookie = getCookie(name);
    if (cookie == null) reload = reloadIfNotSet;
    
    if(typeof value == "object") value = JSON.stringify(value);
    
    try {
    
        document.cookie = name + "=" + value +
                        ";path=" + path +
                        ";expires = " + expires.toGMTString() + "; SameSite=None; Secure";

        if(reload) location.reload();

    } catch (e) {

        console.error(e);
    }
}

function getUser()
{
    var opts = Intl.DateTimeFormat().resolvedOptions();
    return {
        time:new Date(),
        timezone:opts.timeZone,
        calendar:opts.calendar,
        locale:opts.locale,
        numberingSystem:opts.numberingSystem,
        browser(){return navigator.userAgent},
        viewport(){return [
            Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
            Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)]
        }
    };
}

setCookie("user", getUser(), 30*24*3600, true);
window.addEventListener('resize', function(event) {
    setCookie("user", getUser(), 30*24*3600);
});

window.addEventListener('load', function(event) {

    $("[type=submit]").click(function() {

        const style = getComputedStyle(document.body);
        
        var el = $(".has-error");
        if(el.length) return $([document.documentElement, document.body]).animate({scrollTop: $(el[0]).offset().top - parseInt(style["scroll-padding-top"])});

        var el = $(":invalid");
        if(el.length) return $([document.documentElement, document.body]).animate({scrollTop: $(el[el.length-1]).offset().top - parseInt(style["scroll-padding-top"])});
    });
});