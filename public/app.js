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
    CookieConsent.setCookie("user", "necessary", getUser(), 30*24*3600, true);

    window.addEventListener('resize', () => CookieConsent.setCookie("user", "necessary", getUser(), 30*24*3600));
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => CookieConsent.setCookie("user", "necessary", getUser(), 30*24*3600));

    Clipboard.ready();

});

//
// Apply bootstrap form validation
// Lightbox configuration and countdown function
window.addEventListener('load', function(event) {

    lightbox.option({'wrapAround': true});

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

    function countdown(el, timestamp, reload, message = "")
    {
        // Set the date we're counting down to
        var timestamp = new Date(timestamp).getTime();

        // Update the count down every 1 second
        var x = setInterval(function() {

            // Get today's date and time
            var now = Math.floor(new Date().getTime()/1000);

            // Find the distance between now and the count down date
            var countdown = timestamp - now;

            // Time calculations for days, hours, minutes and seconds
            seconds   = countdown % 60;
            countdown = Math.floor(countdown/60);
            minutes   = countdown % 60;
            countdown = Math.floor(countdown/60);
            hours     = countdown % 24;
            countdown = Math.floor(countdown/24);
            days      = countdown % 30;
            countdown = Math.floor(countdown/30);
            months    = countdown % 12;
            years     = Math.floor(countdown/12);

            var elYears       = $(el).find(".countdown-years");
            var oldYears = elYears.html();
                elYears.html(years).removeClass("blink").addClass(oldYears != years ? "blink" : "");
            var elMonths      = $(el).find(".countdown-months");
            var oldMonths = elMonths.html();
                elMonths.html(months).removeClass("blink").addClass(oldMonths != months ? "blink" : "");
            var elDays        = $(el).find(".countdown-days");
            var oldDays = elDays.html();
                elDays.html(days).removeClass("blink").addClass(oldDays != days ? "blink" : "");
            var elHours       = $(el).find(".countdown-hours");
            var oldHours = elHours.html();
                elHours.html(hours).removeClass("blink").addClass(oldHours != hours ? "blink" : "");
            var elMinutes     = $(el).find(".countdown-minutes");
            var oldMinutes = elMinutes.html();
                elMinutes.html(minutes).removeClass("blink").addClass(oldMinutes != minutes ? "blink" : "");
            var elSeconds     = $(el).find(".countdown-seconds");
            var oldSeconds = elSeconds.html();
                elSeconds.html(seconds).removeClass("blink").addClass(oldSeconds != seconds ? "blink" : "");

            var elYearsUnit   = $(elYears).parent().find(".countdown-unit");
            var oldYearsUnit = elYearsUnit.html();
                elYearsUnit.text(years > 1 ? elYearsUnit.data("plural") : elYearsUnit.data("singular"));
                elYearsUnit.removeClass("blink").addClass(oldYearsUnit != elYearsUnit.html() ? "blink" : "");
            var elMonthsUnit  = $(elMonths).parent().find(".countdown-unit");
            var oldMonthsUnit = elMonthsUnit.html();
                elMonthsUnit.text(months > 1 ? elMonthsUnit.data("plural") : elMonthsUnit.data("singular"));
                elMonthsUnit.removeClass("blink").addClass(oldMonthsUnit != elMonthsUnit.html() ? "blink" : "");
            var elDaysUnit    = $(elDays).parent().find(".countdown-unit");
            var oldDaysUnit = elDaysUnit.html();
                elDaysUnit.text(days > 1 ? elDaysUnit.data("plural") : elDaysUnit.data("singular"));
                elDaysUnit.removeClass("blink").addClass(oldDaysUnit != elDaysUnit.html() ? "blink" : "");
            var elHoursUnit   = $(elHours).parent().find(".countdown-unit");
            var oldHoursUnit = elHoursUnit.html();
                elHoursUnit.text(hours > 1 ? elHoursUnit.data("plural") : elHoursUnit.data("singular"));
                elHoursUnit.removeClass("blink").addClass(oldHoursUnit != elHoursUnit.html() ? "blink" : "");
            var elMinutesUnit = $(elMinutes).parent().find(".countdown-unit");
            var oldMinutesUnit = elMinutesUnit.html();
                elMinutesUnit.text(minutes > 1 ? elMinutesUnit.data("plural") : elMinutesUnit.data("singular"));
                elMinutesUnit.removeClass("blink").addClass(oldMinutesUnit != elMinutesUnit.html() ? "blink" : "");
            var elSecondsUnit = $(elSeconds).parent().find(".countdown-unit");
            var oldSecondsUnit = elSecondsUnit.html();
                elSecondsUnit.text(seconds > 1 ? elSecondsUnit.data("plural") : elSecondsUnit.data("singular"));
                elSecondsUnit.removeClass("blink").addClass(oldSecondsUnit != elSecondsUnit.html() ? "blink" : "");

            if(years < 1) {

                var grYears   = $(elYears).closest(".countdown-group");
                grYears.html("");
                if(months < 1) {

                    var grMonths  = $(elMonths).closest(".countdown-group");
                        grMonths.html("");

                    if(days < 1) {

                        var grDays    = $(elDays).closest(".countdown-group");
                            grDays.html("");

                        if(hours < 1) {

                            var grHours   = $(elHours).closest(".countdown-group");
                                grHours.html("");

                            if(minutes < 1) {

                                var grMinutes = $(elMinutes).closest(".countdown-group");
                                    grMinutes.html("");

                                if(seconds < 1) {

                                    var grSeconds = $(elSeconds).closest(".countdown-group");
                                        grSeconds.html("");


                                    countdown.html(message);
                                }
                            }
                        }
                    }
                }
            }


            // If the count down is finished, write some text
            if (countdown < 1) {

                clearInterval(x);
                // if(reload) location.reload();
            }

            $(el).removeClass("invisible");

        }, 1000);
    }

    const countdowns = document.querySelectorAll('[id^="countdown"]');
    countdowns.forEach(e => {
        countdown(e, $(e).data("timestamp"), true);
    });
});