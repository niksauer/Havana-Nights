var data = $.getJSON('../assets/doc/events.json', function(data) {
    var events = data.events;
    
    var today = new Date();
    today.setHours(0,0,0,0);
    
    var public = false; 
    
    if(window.location.pathname != "/user/event.html") {
        public = true;
        
        events = $.grep(events, function(n, i) {
            var date = parseDate(n[0][0]);
            date.setHours(0,0,0,0);
            
            if (date.getTime() >= today.getTime()) {
                return n;
            }
        });
    }

    if (events.length > 0) {
        $('#main .inner header p').addClass('hidden');
        $('div.table-wrapper').append('<table></table>');

        // thead
        $('.table-wrapper table').append('<thead></thead>');
        $('.table-wrapper table thead').append('<tr></tr>');
        var thead = data.thead;
        
        var columns = 0;
        
        if (public) {
            columns = thead.length-1;
            
        } else {
            columns = thead.length;
        }
        
        for (var i = 0; i < columns; i++) {
            $('.table-wrapper thead tr').append('<th>' + thead[i] + '</th>');
        }

        // tbody
        $('.table-wrapper table').append('<tbody></tbody>');
        for(var i = 0; i < events.length; i++) {
            $('.table-wrapper tbody').append('<tr></tr>');
            var event = events[i];

            for(var k = 0; k < columns; k++) {
                if(k == 0) {
                    var dates = event[0];
                    var date = parseDate(dates[0]);
                    var showtime = "";
                    
                    for (j = 1; j < dates.length; j++) {
                        var time = getTime(parseTime(dates[j]));
                        showtime = showtime + ", " + time;
                    }
                    
                    $('.table-wrapper tbody tr:last-child').append('<td>' + getDate(date) + showtime + '</td>')
                } else {
                    $('.table-wrapper tbody tr:last-child').append('<td>' + event[k] + '</td>');
                }
            }
        }

        // tfoot
        var update = parseDate(data.updated);
        $('.table-wrapper table').append('<tfoot></tfoot>');
        $('.table-wrapper tfoot').append('<tr></tr>');
        $('.table-wrapper tfoot tr').append('<td colspan="3" style="text-align: right">Zuletzt aktualisiert: ' + getDate(update) + ' Uhr</td>');
    } else {
        $('#main .inner header p').removeClass('hidden');
    }
});

function parseDate(input) {
  var parts = input.split('-');
  return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
}

function getDate(input) {
    return formatDoubleDigit(input.getDate()) + "." + formatDoubleDigit(input.getMonth()+1) + "." + input.getFullYear();
}

function parseTime(input) {
    var time = input.split(':');  
    var d = new Date(); // creates a Date Object using the clients current time
    d.setHours  (+time[0]); // set Time accordingly, using implicit type coercion
    d.setMinutes( time[1]); // you can pass Number or String, it doesn't matter
    d.setSeconds( time[2]);
    return d;
}

function getTime(input) {
    return formatDoubleDigit(input.getHours()) + ":" + formatDoubleDigit(input.getMinutes()) + " Uhr";
}

function formatDoubleDigit(input) {
    return ("0" + input).slice(-2);
}