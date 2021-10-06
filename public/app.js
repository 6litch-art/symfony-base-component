function setcookie(name, value, expires, path = "/") {

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

    if(typeof value == "object")
        value = JSON.stringify(value);

    var cookie = name + "=" + value +
                ";path=" + path +
                ";expires = " + expires.toGMTString() + "; SameSite=None; Secure";

    document.cookie = cookie;
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

setcookie("user", getUser(), 30*24*3600);
window.addEventListener('resize', function(event) {
    setcookie("user", getUser(), 30*24*3600);
});
