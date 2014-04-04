var rowTemplate = Handlebars.compile($('#stargazer-row-template').html());

var $table = $('tbody');

var $spinner = $('#spinner');


function populateTable(all) {
    $table.empty();
    $spinner.show();
    $.getJSON('data.json')
        .success(function (data) {
            data.forEach(function (e) {
                if (!all && (!e.geocoded_location || e.geocoded_location.country != 'Romania')) {
                    return;
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

populateTable(false);
