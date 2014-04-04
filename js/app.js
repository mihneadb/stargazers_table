var rowTemplate = Handlebars.compile($('#stargazer-row-template').html());

var $table = $('tbody');


function populateTable(all) {
    $table.empty();
    $.getJSON('data.json')
        .success(function (data) {
            data.forEach(function (e) {
                if (!all && (!e.geocoded_location || e.geocoded_location.country != 'Romania')) {
                    return;
                }
                var $row = $(rowTemplate(e));
                $table.append($row);
            });

            $('table').tablesorter();
        });
}

$('#btn-ro').on('click', function () {
    populateTable(false);
});

$('#btn-all').on('click', function () {
    populateTable(true);
});

populateTable(false);
