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
                            // 画像と色を同時に指定
                            let bgColor = info.el.style.backgroundColor || info.el.style.background || "#fff";
                            info.el.style.background = `${bgColor} url('${info.event.extendedProps.bgImage}') center bottom / 50% no-repeat`;
                            info.el.style.opacity = '1';
                        }
                    },
                    dayCellDidMount: function (arg) {
                        // 土日色付け（今月以外も含めて全て）
                        const cellDate = new Date(arg.date);
                        const day = cellDate.getDay();

                        if (day === 0) {
                            arg.el.style.background = "#ffe0e0";
                        } else if (day === 6) {
                            arg.el.style.background = "#e0e0ff";
                        } else {
                            arg.el.style.background = "#fff";
                        }

                        // 今月の過去日はグレーで上書き
                        if (!arg.isOther) {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const cellDateOnly = new Date(arg.date);
                            cellDateOnly.setHours(0, 0, 0, 0);
                            if (cellDateOnly < today) {
                                arg.el.style.background = "#e0e0e0";
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
