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
                if (status === '地域最安値') image = 'img/koara.png';
                if (status === '要相談') image = 'img/kirin.png';
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

            const nextBtn = document.createElement('button');
            nextBtn.textContent = '＞';
            nextBtn.id = 'next-month';

            // ボタンサイズを画面幅で切り替え
            function setButtonSize() {
                if (window.innerWidth <= 600) {
                    prevBtn.style.fontSize = '1em';
                    prevBtn.style.padding = '0.1em 0.3em';
                    prevBtn.style.minWidth = '20px';
                    prevBtn.style.width = '20px';

                    nextBtn.style.fontSize = '1em';
                    nextBtn.style.padding = '0.1em 0.3em';
                    nextBtn.style.minWidth = '20px';
                    nextBtn.style.width = '20px';
                } else {
                    prevBtn.style.fontSize = '1.5em';
                    prevBtn.style.padding = '0.3em 0.8em';
                    prevBtn.style.minWidth = '';
                    prevBtn.style.width = '';

                    nextBtn.style.fontSize = '1.5em';
                    nextBtn.style.padding = '0.3em 0.8em';
                    nextBtn.style.minWidth = '';
                    nextBtn.style.width = '';
                }
            }
            setButtonSize();
            window.addEventListener('resize', setButtonSize);


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
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const eventDate = new Date(info.event.start);
                        eventDate.setHours(0, 0, 0, 0);

                        // ステータスごとに画像サイズを指定
                        let bgSize = "50%";
                        const img = info.event.extendedProps.bgImage;
                        if (img) {
                            if (img.includes('koara')) bgSize = "60%";
                            if (img.includes('kirin')) bgSize = "40%";
                            if (img.includes('ele')) bgSize = "60%";
                        }

                        if (eventDate <= today) {
                            // 画像を消す（背景を色だけに）
                            info.el.style.backgroundImage = 'none';
                        } else if (img) {
                            let bgColor = info.el.style.backgroundColor || info.el.style.background || "#fff";
                            info.el.style.background = `${bgColor} url('${img}') center bottom / ${bgSize} no-repeat`;
                            info.el.style.opacity = '1';
                        }
                    },
                    dayCellDidMount: function (arg) {
                        const cellDate = new Date(arg.date);
                        const day = cellDate.getDay();

                        // 今日の日付を取得
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        cellDate.setHours(0, 0, 0, 0);

                        // 今日
                        if (cellDate.getTime() === today.getTime()) {
                            arg.el.style.background = "#fff9b2"; // 黄色
                        }
                        // 今月の過去日は赤斜線
                        else if (cellDate < today) {
                            // 土日色を判定
                            if (day === 0) {
                                arg.el.style.backgroundColor = "#ffe0e0"; // 日曜: 薄い赤
                            } else if (day === 6) {
                                arg.el.style.backgroundColor = "#e0e0ff"; // 土曜: 薄い青
                            } else {
                                arg.el.style.backgroundColor = "#fff";    // 平日: 白
                            }
                            // 赤斜線を重ねる
                            arg.el.style.backgroundImage = "linear-gradient(146deg, transparent 48%, #ff6b6b 50%, #ff6b6b 52%, transparent 54%)";
                        }
                        // 日曜
                        else if (day === 0) {
                            arg.el.style.background = "#ffe0e0";
                        }
                        // 土曜
                        else if (day === 6) {
                            arg.el.style.background = "#e0e0ff";
                        }
                        // 平日
                        else {
                            arg.el.style.background = "#fff";
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
