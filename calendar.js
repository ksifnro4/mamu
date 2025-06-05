// calendar.js
const calendarId = "mamumoving.tokyo@gmail.com"; // ここにカレンダーIDを入れてください
const baseUrl =
    "https://calendar.google.com/calendar/embed?src=" +
    encodeURIComponent(calendarId) +
    "&ctz=Asia%2FTokyo&mode=MONTH&showTitle=0&showNav=0&showDate=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0";

function formatDate(date) {
    return (
        date.getFullYear().toString() +
        String(date.getMonth() + 1).padStart(2, "0") +
        String(date.getDate()).padStart(2, "0")
    );
}

function getMonthRange(year, month) {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    return { start, end };
}

function setCalendarSrc() {
    const now = new Date();

    // 今月
    const thisMonthRange = getMonthRange(now.getFullYear(), now.getMonth());
    const thisMonthDates =
        formatDate(thisMonthRange.start) + "/" + formatDate(thisMonthRange.end);
    const thisMonthUrl = baseUrl + "&dates=" + thisMonthDates;

    // 翌月
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const nextMonthRange = getMonthRange(nextMonth.getFullYear(), nextMonth.getMonth());
    const nextMonthDates =
        formatDate(nextMonthRange.start) + "/" + formatDate(nextMonthRange.end);
    const nextMonthUrl = baseUrl + "&dates=" + nextMonthDates;

    // iframeにURLセット
    document.getElementById("iframe-this-month").src = thisMonthUrl;
    document.getElementById("iframe-next-month").src = nextMonthUrl;
}

// ページ読み込み後に呼び出す
window.addEventListener("DOMContentLoaded", setCalendarSrc);
