document.addEventListener('DOMContentLoaded', function () {
    var csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTUAarqIC5JiexoMdhJH5pPlIjiMmPjUPll18r4LHVsuUM_SlbqZxx8DlAF2ZpFV8Rr-V87bxD6_Dy8/pub?output=csv';

    Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: function (results) {
            var events = results.data.map(function (row) {
                const status = row.状況 ? row.状況.trim() : '';
                let color = '';
                let image = '';

                // ステータスごとに画像パスを指定
                if (status === '赤字覚悟！') image = 'img/kan.png';
                if (status === '頑張ります！') image = 'img/usa.png';
                if (status === '満車') image = 'img/ele.png';

                // 色が無ければ表示しない
                if (!image) return null;

                return {
                    title: '', // タイトル不要なら''
                    start: row.日付.replace(/\//g, '-'),
                    display: 'background', // 背景イベントとして表示
                    backgroundColor: 'transparent', // 背景色を透明に
                    // FullCalendar v5/v6: backgroundImageは直接指定できないので、eventDidMountで画像を適用
                    extendedProps: {
                        bgImage: image
                    }
                };
            }).filter(e => e !== null);

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
                        if (info.event.extendedProps.bgImage) {
                            info.el.style.backgroundImage = `url('${info.event.extendedProps.bgImage}')`;
                            info.el.style.backgroundSize = 'cover';
                            info.el.style.backgroundPosition = 'bottom';
                            info.el.style.backgroundRepeat = 'no-repeat';
                            info.el.style.opacity = '1';
                            info.el.style.backgroundSize = '110%';
                        }
                    },
                    dayCellDidMount: function (arg) {
                        // 今月以外のセルは何もしない
                        if (arg.isOther) return;

                        // 今日より前の日付を灰色に
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const cellDate = new Date(arg.date);
                        cellDate.setHours(0, 0, 0, 0);

                        if (cellDate < today) {
                            arg.el.style.background = "#e0e0e0";
                        } else {
                            // 日曜は赤、土曜は青
                            const day = cellDate.getDay();
                            if (day === 0) {
                                arg.el.style.background = "#ffe0e0"; // 日曜: 薄い赤
                            } else if (day === 6) {
                                arg.el.style.background = "#e0e0ff"; // 土曜: 薄い青
                            }
                        }
                    }
                });
                calendar.render();
            });
        }
    });
});