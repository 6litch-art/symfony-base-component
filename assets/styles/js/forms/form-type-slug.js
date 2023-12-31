window.addEventListener("load.form_type", function () {

    function trim (s, c) {
        if (c === "]") c = "\\]";
        if (c === "^") c = "\\^";
        if (c === "\\") c = "\\\\";
        return s.replace(new RegExp(
            "^[" + c + "]+|[" + c + "]+$", "g"
        ), "");
        }

    ! function (e) {
        var t = {};

        function n(r) {
            if (t[r]) return t[r].exports;
            var o = t[r] = {
                i: r,
                l: !1,
                exports: {}
            };
            return e[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports
        }
        n.m = e, n.c = t, n.d = function (e, t, r) {
            n.o(e, t) || Object.defineProperty(e, t, {
                enumerable: !0,
                get: r
            })
        }, n.r = function (e) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(e, "__esModule", {
                value: !0
            })
        }, n.t = function (e, t) {
            if (1 & t && (e = n(e)), 8 & t) return e;
            if (4 & t && "object" == typeof e && e && e.__esModule) return e;
            var r = Object.create(null);
            if (n.r(r), Object.defineProperty(r, "default", {
                    enumerable: !0,
                    value: e
                }), 2 & t && "string" != typeof e)
                for (var o in e) n.d(r, o, function (t) {
                    return e[t]
                }.bind(null, o));
            return r
        }, n.n = function (e) {
            var t = e && e.__esModule ? function () {
                return e.default
            } : function () {
                return e
            };
            return n.d(t, "a", t), t
        }, n.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }, n.p = "./", n(n.s = "v2jg")
    }({
        NmYn: function (e, t, n) {
            var r;
            r = function () {
                var e = JSON.parse('{":":":","$":"dollar","%":"percent","&":"and","<":"less",">":"greater","|":"or","¢":"cent","£":"pound","¤":"currency","¥":"yen","©":"(c)","ª":"a","®":"(r)","º":"o","À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","Æ":"AE","Ç":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ì":"I","Í":"I","Î":"I","Ï":"I","Ð":"D","Ñ":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","Ù":"U","Ú":"U","Û":"U","Ü":"U","Ý":"Y","Þ":"TH","ß":"ss","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","æ":"ae","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ì":"i","í":"i","î":"i","ï":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"u","ý":"y","þ":"th","ÿ":"y","Ā":"A","ā":"a","Ă":"A","ă":"a","Ą":"A","ą":"a","Ć":"C","ć":"c","Č":"C","č":"c","Ď":"D","ď":"d","Đ":"DJ","đ":"dj","Ē":"E","ē":"e","Ė":"E","ė":"e","Ę":"e","ę":"e","Ě":"E","ě":"e","Ğ":"G","ğ":"g","Ģ":"G","ģ":"g","Ĩ":"I","ĩ":"i","Ī":"i","ī":"i","Į":"I","į":"i","İ":"I","ı":"i","Ķ":"k","ķ":"k","Ļ":"L","ļ":"l","Ľ":"L","ľ":"l","Ł":"L","ł":"l","Ń":"N","ń":"n","Ņ":"N","ņ":"n","Ň":"N","ň":"n","Ō":"O","ō":"o","Ő":"O","ő":"o","Œ":"OE","œ":"oe","Ŕ":"R","ŕ":"r","Ř":"R","ř":"r","Ś":"S","ś":"s","Ş":"S","ş":"s","Š":"S","š":"s","Ţ":"T","ţ":"t","Ť":"T","ť":"t","Ũ":"U","ũ":"u","Ū":"u","ū":"u","Ů":"U","ů":"u","Ű":"U","ű":"u","Ų":"U","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","ź":"z","Ż":"Z","ż":"z","Ž":"Z","ž":"z","Ə":"E","ƒ":"f","Ơ":"O","ơ":"o","Ư":"U","ư":"u","ǈ":"LJ","ǉ":"lj","ǋ":"NJ","ǌ":"nj","Ș":"S","ș":"s","Ț":"T","ț":"t","ə":"e","˚":"o","Ά":"A","Έ":"E","Ή":"H","Ί":"I","Ό":"O","Ύ":"Y","Ώ":"W","ΐ":"i","Α":"A","Β":"B","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"H","Θ":"8","Ι":"I","Κ":"K","Λ":"L","Μ":"M","Ν":"N","Ξ":"3","Ο":"O","Π":"P","Ρ":"R","Σ":"S","Τ":"T","Υ":"Y","Φ":"F","Χ":"X","Ψ":"PS","Ω":"W","Ϊ":"I","Ϋ":"Y","ά":"a","έ":"e","ή":"h","ί":"i","ΰ":"y","α":"a","β":"b","γ":"g","δ":"d","ε":"e","ζ":"z","η":"h","θ":"8","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"3","ο":"o","π":"p","ρ":"r","ς":"s","σ":"s","τ":"t","υ":"y","φ":"f","χ":"x","ψ":"ps","ω":"w","ϊ":"i","ϋ":"y","ό":"o","ύ":"y","ώ":"w","Ё":"Yo","Ђ":"DJ","Є":"Ye","І":"I","Ї":"Yi","Ј":"J","Љ":"LJ","Њ":"NJ","Ћ":"C","Џ":"DZ","А":"A","Б":"B","В":"V","Г":"G","Д":"D","Е":"E","Ж":"Zh","З":"Z","И":"I","Й":"J","К":"K","Л":"L","М":"M","Н":"N","О":"O","П":"P","Р":"R","С":"S","Т":"T","У":"U","Ф":"F","Х":"H","Ц":"C","Ч":"Ch","Ш":"Sh","Щ":"Sh","Ъ":"U","Ы":"Y","Ь":"","Э":"E","Ю":"Yu","Я":"Ya","а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ж":"zh","з":"z","и":"i","й":"j","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"c","ч":"ch","ш":"sh","щ":"sh","ъ":"u","ы":"y","ь":"","э":"e","ю":"yu","я":"ya","ё":"yo","ђ":"dj","є":"ye","і":"i","ї":"yi","ј":"j","љ":"lj","њ":"nj","ћ":"c","ѝ":"u","џ":"dz","Ґ":"G","ґ":"g","Ғ":"GH","ғ":"gh","Қ":"KH","қ":"kh","Ң":"NG","ң":"ng","Ү":"UE","ү":"ue","Ұ":"U","ұ":"u","Һ":"H","һ":"h","Ә":"AE","ә":"ae","Ө":"OE","ө":"oe","฿":"baht","ა":"a","ბ":"b","გ":"g","დ":"d","ე":"e","ვ":"v","ზ":"z","თ":"t","ი":"i","კ":"k","ლ":"l","მ":"m","ნ":"n","ო":"o","პ":"p","ჟ":"zh","რ":"r","ს":"s","ტ":"t","უ":"u","ფ":"f","ქ":"k","ღ":"gh","ყ":"q","შ":"sh","ჩ":"ch","ც":"ts","ძ":"dz","წ":"ts","ჭ":"ch","ხ":"kh","ჯ":"j","ჰ":"h","Ẁ":"W","ẁ":"w","Ẃ":"W","ẃ":"w","Ẅ":"W","ẅ":"w","ẞ":"SS","Ạ":"A","ạ":"a","Ả":"A","ả":"a","Ấ":"A","ấ":"a","Ầ":"A","ầ":"a","Ẩ":"A","ẩ":"a","Ẫ":"A","ẫ":"a","Ậ":"A","ậ":"a","Ắ":"A","ắ":"a","Ằ":"A","ằ":"a","Ẳ":"A","ẳ":"a","Ẵ":"A","ẵ":"a","Ặ":"A","ặ":"a","Ẹ":"E","ẹ":"e","Ẻ":"E","ẻ":"e","Ẽ":"E","ẽ":"e","Ế":"E","ế":"e","Ề":"E","ề":"e","Ể":"E","ể":"e","Ễ":"E","ễ":"e","Ệ":"E","ệ":"e","Ỉ":"I","ỉ":"i","Ị":"I","ị":"i","Ọ":"O","ọ":"o","Ỏ":"O","ỏ":"o","Ố":"O","ố":"o","Ồ":"O","ồ":"o","Ổ":"O","ổ":"o","Ỗ":"O","ỗ":"o","Ộ":"O","ộ":"o","Ớ":"O","ớ":"o","Ờ":"O","ờ":"o","Ở":"O","ở":"o","Ỡ":"O","ỡ":"o","Ợ":"O","ợ":"o","Ụ":"U","ụ":"u","Ủ":"U","ủ":"u","Ứ":"U","ứ":"u","Ừ":"U","ừ":"u","Ử":"U","ử":"u","Ữ":"U","ữ":"u","Ự":"U","ự":"u","Ỳ":"Y","ỳ":"y","Ỵ":"Y","ỵ":"y","Ỷ":"Y","ỷ":"y","Ỹ":"Y","ỹ":"y","‘":"\'","’":"\'","“":"\\"","”":"\\"","†":"+","•":"*","…":"...","₠":"ecu","₢":"cruzeiro","₣":"french franc","₤":"lira","₥":"mill","₦":"naira","₧":"peseta","₨":"rupee","₩":"won","₪":"new shequel","₫":"dong","€":"euro","₭":"kip","₮":"tugrik","₯":"drachma","₰":"penny","₱":"peso","₲":"guarani","₳":"austral","₴":"hryvnia","₵":"cedi","₸":"kazakhstani tenge","₹":"indian rupee","₺":"turkish lira","₽":"russian ruble","₿":"bitcoin","℠":"sm","™":"tm","∂":"d","∆":"delta","∑":"sum","∞":"infinity","♥":"love","元":"yuan","円":"yen","﷼":"rial"}'),
                    t = JSON.parse('{"de":{"Ä":"AE","ä":"ae","Ö":"OE","ö":"oe","Ü":"UE","ü":"ue","%":"prozent","&":"und","|":"oder","∑":"summe","∞":"unendlich","♥":"liebe"},"vi":{"Đ":"D","đ":"d"},"fr":{"%":"pourcent","&":"et","<":"plus petit",">":"plus grand","|":"ou","¢":"centime","£":"livre","¤":"devise","₣":"franc","∑":"somme","∞":"infini","♥":"amour"}}');

                function n(n, r) {
                    if ("string" != typeof n) throw new Error("slugify: string argument expected");

                    var o = t[(r = "string" == typeof r ? {
                        separator: r
                        } : r || {}).locale] || {},
                        i = void 0 === r.separator ? "-" : r.separator,

                        a = n.normalize().split("").reduce((function (t, n) {
                            var i = o[n] || e[n] || n;
                            return i === r && (i = " "), t + i.replace(n.remove || /[^\w\s$*_+~\.()'"!\-:@]+/g, "")
                        }), "").trim().replace(new RegExp("[\\s" + i + "]+", "g"), i);

                        a = a.toLowerCase();
                        return r.upper && (a = a.toUpperCase()), r.strict && (a = a.replace(new RegExp("[^a-zA-Z0-9" + i + "]", "g"), "").replace(new RegExp("[\\s" + i + "]+", "g"), i)), a
                }
                return n.extend = function (t) {
                    for (var n in t) e[n] = t[n]
                }, n
            }, e.exports = r(), e.exports.default = r()
        },
        v2jg: function (e, t, n) {
            function r(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                }
            }
            var o = n("NmYn");
            o.extend({
                $: "", "%": "", "&": "", "<": "", ">": "", "|": "",
                "¢": "", "£": "", "¤": "", "¥": "", "₠": "", "₢": "", "₣": "", "₤": "", "₥": "", "₦": "",
                "₧": "", "₨": "", "₩": "", "₪": "", "₫": "", "€": "", "₭": "", "₮": "", "₯": "", "₰": "", "₱": "", "₲": "",
                "₳": "", "₴": "", "₵": "", "₸": "", "₹": "", "₽": "", "₿": "", "∂": "", "∆": "", "∑": "", "∞": "", "♥": "", "元": "", "円": "", "﷼": ""
            });
            var i = function () {
                "use strict";

                function e(t) {
                    ! function (e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }(this, e), this.field = t, this.setTargetElement(), this.locked = !0, this.field.setAttribute("readonly", "readonly"), "" === this.field.value ? (this.currentSlug = "", this.updateValue(), this.listenTarget()) : this.currentSlug = this.field.value, this.appendLockButton()
                }
                var t, n, i;
                return t = e, (n = [{
                    key: "setTargetElement",
                    value: function () {
                        this.target = document.getElementById($(this.field).data("slug-target"));
                    }
                }, {
                    key: "appendLockButton",
                    value: function () {
                        var e = this;
                        this.lockButton = this.field.parentNode.querySelector("button"), this.lockButtonIcon = this.lockButton.querySelector("i"), this.lockButton.addEventListener("click", (function () {
                            if (e.locked) {
                                var t = e.field.dataset.confirmText || null;
                                if (null === t) e.unlock();
                                else {
                                    var n = decodeURIComponent(JSON.parse('"' + t.replace(/\"/g, '\\"') + '"'));
                                    !0 === confirm(n) && e.unlock()
                                }
                            } else e.lock()
                        }))
                    }
                }, {
                    key: "unlock",
                    value: function () {

                        this.locked = !1, this.lockButtonIcon.classList.replace("fa-lock", "fa-lock-open"), this.field.removeAttribute("readonly")
                        this.field.value = this.currentSlug;
                    }
                }, {
                    key: "lock",
                    value: function () {
                        this.locked = !0, this.lockButtonIcon.classList.replace("fa-lock-open", "fa-lock"), "" !== this.currentSlug ? this.field.value = this.currentSlug : this.updateValue(), this.field.setAttribute("readonly", "readonly")
                    }
                }, {
                    key: "updateValue",
                    value: function (value = undefined) {

                        if(!this.target) return;
                        this.field.value = this.compute(value)
                    }
                }, {
                    key: "compute",
                    value: function (value = undefined) {

                        if(!this.target) return;

                        var keep   = $(this.field).data("slug-keep") ?? "";
                        var upper  = JSON.parse($(this.field).data("slug-upper") ?? "true");
                        var strict = JSON.parse($(this.field).data("slug-strict") ?? "true");
                        var separator = $(this.field).data("slug-separator") ?? "-";

                        function escapeRegExp(text) {
                            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
                        }

                        return trim(o(value ?? this.target.value, {
                            remove: new RegExp("[^A-Za-z0-9\s"+escapeRegExp(keep)+escapeRegExp(separator)+"]", "g"),
                            upper: upper,
                            strict: strict,
                            separator : separator
                        }), separator)
                    }
                }, {
                    key: "listenTarget",
                    value: function () {
                        var e = this;
                        if(!this.target) return;
                        this.target.addEventListener("change", (function (t) {
                            "readonly" === e.field.getAttribute("readonly") && e.updateValue()
                        }))
                    }
                }]) && r(t.prototype, n), i && r(t, i), e
            }();

            document.querySelectorAll("[data-slug-target]").forEach((function (e) {

                // On slug change
                var slugger = new i(e);
                if(!slugger.target)
                {
                    slugger.unlock();
                    return;
                }

                var label     = slugger.target ? $('label[for="' + slugger.target.id + '"]') : undefined;
                var lock      = JSON.parse($(slugger.field).data("slug-lock") ?? null) && slugger.target != undefined;

                var targetCurrentSlug = slugger.target != undefined ? $(slugger.target).val() : $(slugger.field).val();
                slugger.updateValue(targetCurrentSlug);

                     if(lock === false ) slugger.unlock();
                else if(lock === true  ) slugger.lock();
                else if(slugger.compute(targetCurrentSlug) == slugger.currentSlug) slugger.lock();
                else slugger.unlock();

                var isTargetRequired = (slugger.locked ? slugger.field.getAttribute("required") : slugger.target.getAttribute("data-required")) == "required";
                if (isTargetRequired) {
                    label.addClass("required");
                    slugger.target.setAttribute("required", true);
                } else {
                    label.removeClass("required");
                    slugger.target.removeAttribute("required");
                }

                if(lock !== null) $(slugger.lockButton).prop("disabled", true);
                else {

                    slugger.lockButton.addEventListener("click", function () {

                        if(slugger.locked || targetCurrentSlug == "")
                            slugger.updateValue();

                        var label = $('label[for="' + slugger.target.id + '"]');
                        var isTargetRequired = (slugger.locked ? slugger.field.getAttribute("required") : slugger.target.getAttribute("data-required")) == "required";
                        if (isTargetRequired) {
                            label.addClass("required");
                            slugger.target.setAttribute("required", true);
                        } else {
                            label.removeClass("required");
                            slugger.target.removeAttribute("required");
                        }
                    });
                }

                $(slugger.field).on('input change keyup', function() {
                    slugger.updateValue(this.value);
                });

                $(slugger.target).on('input change keyup', function() {

                    if(!slugger.locked) return;
                    slugger.updateValue();
                });
            }))
        }
    });
});