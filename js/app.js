var rowTemplate = Handlebars.compile($('#stargazer-row-template').html());

var $table = $('tbody');

var $spinner = $('#spinner');

var roNames = [];

function isROName(name) {
    if (!name) {
        return false;
    }
    var words = name.split(/-|\ /);
    var r = false;
    words.forEach(function (w) {
        var pos = roNames.indexOf(w.toLowerCase());
        if (pos !== -1) {
            r = true;
        }
    });
    return r;
}

function populateTable(all) {
    $table.empty();
    $spinner.show();
    $.getJSON('data.json')
        .success(function (data) {
            data.forEach(function (e) {
                if (!all &&
                    (!e.geocoded_location ||
                     e.geocoded_location.country !== 'Romania')) {
                    if (!isROName(e.name)) {
                        return;
                    } else if (e.geocoded_location && e.geocoded_location.country !== 'Romania') {
                        return;
                    }
                }
                var $row = $(rowTemplate(e));
                $table.append($row);
            });

            $spinner.hide();
            $('table').tablesorter();
        });
}

$('#btn-ro').on('click', function () {
    populateTable(false);
});

$('#btn-all').on('click', function () {
    populateTable(true);
});

$.getJSON('ro_names.json')
    .success(function (data) {
        roNames = data.map(function (e) { return e.toLowerCase(); });
        populateTable(false);
    });

