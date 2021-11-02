document.querySelectorAll("[data-select2-field]").forEach((function (el) {

    console.log(el);
    var select2 = $(el).data('select2-field');
    
    $(el).select2(select2);
}));