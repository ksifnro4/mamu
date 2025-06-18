document.addEventListener('DOMContentLoaded', function () {
    var csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTUAarqIC5JiexoMdhJH5pPlIjiMmPjUPll18r4LHVsuUM_SlbqZxx8DlAF2ZpFV8Rr-V87bxD6_Dy8/pub?output=csv';

    Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: function (results) {
            var events = results.data.map(function (row) {
                const status = row.状況 ? row.状況.trim() : '';
                let image = '';

                // ステータスごとに画像パスを指定
                if (status === '赤字覚悟！') image = 'img/kan.png';
                if (status === '頑張ります！') image = 'img/usa.png';
                if (status === '満車') image = 'img/ele.png';

                // 画像が無ければ表示しない
                if (!image) return null;

                return {
                    title: '',
                    start: row.日付.replace(/\//g, '-'),
                    display: 'background',
                    backgroundColor: 'transparent',
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

            // スライダー用の変数
            let currentMonthIndex = 0;
            const calendarContainer = document.getElementById('calendar');
            let calendar;

            // スライダー用のボタンを作成
            const sliderWrapper = document.createElement('div');
            sliderWrapper.style.display = 'flex';
            sliderWrapper.style.alignItems = 'center';
            sliderWrapper.style.justifyContent = 'center';
            sliderWrapper.style.gap = '16px';

            const prevBtn = document.createElement('button');
            prevBtn.textContent = '＜';
            prevBtn.id = 'prev-month';
            prevBtn.style.fontSize = '1.5em';
            prevBtn.style.padding = '0.3em 0.8em';

            const nextBtn = document.createElement('button');
            nextBtn.textContent = '＞';
            nextBtn.id = 'next-month';
            nextBtn.style.fontSize = '1.5em';
            nextBtn.style.padding = '0.3em 0.8em';

            const calDiv = document.createElement('div');
            calDiv.id = 'calendar-slide';
            calDiv.style.width = '800px';

            sliderWrapper.appendChild(prevBtn);
            sliderWrapper.appendChild(calDiv);
            sliderWrapper.appendChild(nextBtn);

            calendarContainer.innerHTML = '';
            calendarContainer.appendChild(sliderWrapper);

            function renderCalendar(monthIndex) {
                calDiv.innerHTML = '';
                calendar = new FullCalendar.Calendar(calDiv, {
                    initialView: 'dayGridMonth',
                    initialDate: months[monthIndex],
                    events: events,
                    locale: 'ja',
                    height: 'auto',
                    headerToolbar: {
                        left: '',
                        center: 'title',
                        right: ''
                    },
                    titleFormat: { month: 'long' }, // 年を非表示、月のみ表示
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
                            info.el.style.backgroundSize = '50%';
                        }
                    },
                    dayCellDidMount: function (arg) {
                        if (arg.isOther) return;

                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const cellDate = new Date(arg.date);
                        cellDate.setHours(0, 0, 0, 0);

                        // まず背景色をクリア
                        arg.el.style.background = '';

                        if (cellDate < today) {
                            arg.el.style.backgroundColor = "#e0e0e0";
                        } else {
                            const day = cellDate.getDay();
                            if (day === 0) {
                                arg.el.style.backgroundColor = "#ffe0e0"; // 日曜: 薄い赤
                            } else if (day === 6) {
                                arg.el.style.backgroundColor = "#e0e0ff"; // 土曜: 薄い青
                            } else {
                                arg.el.style.backgroundColor = ""; // 平日は色なし
                            }
                        }
                    }
                });
                calendar.render();
            }

            // 初期表示
            renderCalendar(currentMonthIndex);

            // ボタンで切り替え
            prevBtn.onclick = function () {
                if (currentMonthIndex > 0) {
                    currentMonthIndex--;
                    renderCalendar(currentMonthIndex);
                }
            };
            nextBtn.onclick = function () {
                if (currentMonthIndex < 2) {
                    currentMonthIndex++;
                    renderCalendar(currentMonthIndex);
                }
            };
        }
    });
});