console.log("FullCalendar type:", typeof FullCalendar);


document.addEventListener('DOMContentLoaded', function () {
    // ここにあなたのCSV公開URLを記入！
    var csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTUAarqIC5JiexoMdhJH5pPlIjiMmPjUPll18r4LHVsuUM_SlbqZxx8DlAF2ZpFV8Rr-V87bxD6_Dy8/pub?output=csv';

    Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: function (results) {
            var events = results.data.map(function (row) {
                let color = '';
                if (row.状況 === '空き') color = '#d3ffd3';
                if (row.状況 === '混雑') color = '#ffe0e0';
                if (row.状況 === 'おすすめ') color = '#fff5cc';
                return {
                    title: row.状況,
                    start: row.日付,
                    color: color,
                    description: row.備考 || ''
                };
            });

            const now = new Date();

            // 今月
            var calendar1 = new FullCalendar.Calendar(document.getElementById('calendar1'), {
                initialView: 'dayGridMonth',
                initialDate: now,
                events: events,
                locale: 'ja',
                height: 390,
                eventDidMount: function (info) {
                    if (info.event.extendedProps.description) {
                        info.el.title = info.event.extendedProps.description;
                    }
                }
            });
            calendar1.render();

            // 来月
            const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            var calendar2 = new FullCalendar.Calendar(document.getElementById('calendar2'), {
                initialView: 'dayGridMonth',
                initialDate: nextMonth,
                events: events,
                locale: 'ja',
                height: 390,
                eventDidMount: function (info) {
                    if (info.event.extendedProps.description) {
                        info.el.title = info.event.extendedProps.description;
                    }
                }
            });
            calendar2.render();

            // 再来月
            const nextNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 1);
            var calendar3 = new FullCalendar.Calendar(document.getElementById('calendar3'), {
                initialView: 'dayGridMonth',
                initialDate: nextNextMonth,
                events: events,
                locale: 'ja',
                height: 390,
                eventDidMount: function (info) {
                    if (info.event.extendedProps.description) {
                        info.el.title = info.event.extendedProps.description;
                    }
                }
            });
            calendar3.render();
        }
    });
});
