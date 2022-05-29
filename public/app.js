window.addEventListener('DOMContentLoaded', function(event) {

    function getUser()
    {
        var opts = Intl.DateTimeFormat().resolvedOptions();

        return {
            time:new Date(),
            timezone:opts.timeZone,
            calendar:opts.calendar,
            locale:opts.locale,
            darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
            numberingSystem:opts.numberingSystem,
            browser(){return navigator.userAgent},
            viewport(){return [
                Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
                Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)]
            }
        };
    }

    //
    // Save user information
    CookieConsent.ready();
    CookieConsent.setCookie("necessary", "user", getUser(), 30*24*3600, true);
    window.addEventListener('resize', () => CookieConsent.setCookie("necessary", "user", getUser(), 30*24*3600));
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => CookieConsent.setCookie("necessary", "user", getUser(), 30*24*3600));

    Clipboard.ready();
});

//
// Apply bootstrap form validation
window.addEventListener('load', function(event) {

    $("form.needs-validation input").on("invalid", (e) => e.preventDefault() );
    $("[type=submit]").click(function() {

        const style = getComputedStyle(document.body);

        var form = $(".has-error").closest("form.needs-validation");
        if(!form.length) form = $(this).closest("form.needs-validation");

        if (!this.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
        }

        var el = $(":invalid, .has-error").not("form");
        if (el.length) return $([document.documentElement, document.body]).animate(
            {scrollTop: $(el[0]).offset().top - parseInt(style["scroll-padding-top"])},
            function() { form.addClass('was-validated'); }
        );
    });
});