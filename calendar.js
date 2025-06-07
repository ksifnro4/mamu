document.addEventListener('DOMContentLoaded', function () {
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
                    title: '',
                    start: row.日付,
                    color: color,
                };
            });

            // 今月、来月、再来月の年月を取得
            const now = new Date();
            const months = [
                new Date(now.getFullYear(), now.getMonth(), 1),
                new Date(now.getFullYear(), now.getMonth() + 1, 1),
                new Date(now.getFullYear(), now.getMonth() + 2, 1)
            ];

            // カレンダーを3つ並べて表示
            const calendarContainer = document.getElementById('calendar');
            calendarContainer.innerHTML = ''; // クリア

            months.forEach((date, idx) => {
                const calDiv = document.createElement('div');
                calDiv.id = 'calendar_' + idx;
                calDiv.style.display = 'inline-block';
                calDiv.style.width = '320px';
                calDiv.style.verticalAlign = 'top';
                calDiv.style.marginRight = '16px';
                calendarContainer.appendChild(calDiv);

                const calendar = new FullCalendar.Calendar(calDiv, {
                    initialView: 'dayGridMonth',
                    initialDate: date,
                    events: events,
                    locale: 'ja',
                    height: 'auto',
                    headerToolbar: {
                        left: '',
                        center: 'title',
                        right: ''
                    },
                    showNonCurrentDates: false,
                    dayCellContent: function (arg) {
                        return arg.date.getDate();
                    },
                    eventDidMount: function (info) {
                        if (info.event.extendedProps.description) {
                            info.el.title = info.event.extendedProps.description;
                        }
                    }
                });
                calendar.render();
            });
        }
    });
});