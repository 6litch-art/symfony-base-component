$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.password", function () {

        document.querySelectorAll("[data-password-field]").forEach(function (el) {
            
            var id = el.getAttribute("data-password-field");
            
            var plainPassword = $("#"+id+"_plain");
            var plainPasswordRepeater = $("#"+id+"_plain_repeater");
            var revealer = $("#"+id+"_revealer");
            var details  = $("#"+id+"_details");

            var minStrength      = el.getAttribute("data-password-minstrength") ?? 0;
            var minStrengthStr   = el.getAttribute("data-password-minstrength-str");
            var passwordMatchStr = el.getAttribute("data-password-match-str");

            function checkStrength(strength) { plainPassword[0].setCustomValidity(strength > minStrength ? "" : minStrengthStr); }
            checkStrength(0);

            var strength = 0;
            plainPassword.on('input', function(e) {

                strength = 0;
                strengthList = [/[a-z]+/, /[A-Z]+/,/[0-9]+/,/\W+/,/.{12,}/];

                for (let i = 0; i < strengthList.length; i++) {

                    var ith = details.find("#"+id+"_strength")[i];
                    if(!strengthList[i].test(plainPassword.val())) {
                    
                        $(ith).removeClass("fa-check-circle check").addClass("fa-times-circle uncheck");
                    
                    } else {

                        $(ith).removeClass("fa-times-circle uncheck").addClass("fa-check-circle check")
                        strength++;
                    }
                }

                $('[id^="'+id+'_strength_"]').removeClass().addClass("strength");
                for (let i = 1; i < strength+1; i++)
                    $("#"+id+"_strength_"+i).removeClass().addClass("strength strength_"+strength);

                checkStrength(strength);
            });

            if (plainPasswordRepeater.length) {

                function checkMatch() { plainPasswordRepeater[0].setCustomValidity(plainPassword.val() != plainPasswordRepeater.val() ? passwordMatchStr : ""); }
                plainPasswordRepeater.on('input', checkMatch);
                checkMatch();
            }

            revealer.on("click", function (e) {

                var isRevealed = plainPassword.prop("type") === 'text';

                revealer.removeClass("fa-eye fa-eye-slash").addClass(isRevealed ? "fa-eye" : "fa-eye-slash");
                plainPassword.prop('type', isRevealed ? 'password' : 'text');
            });
        });
    });

    $(document).trigger("load.form_type.password");
});