window.addEventListener("DOMContentLoaded", function () {
    const stopWatch = document.getElementById("stopWatch");
    const startBtn = document.getElementById("start");
    const stopBtn = document.getElementById("stop");
    const resetBtn = document.getElementById("reset");

    let startTimer = null;

    let [hours, minutes, seconds] = [0, 0, 0];

    function disabled(...elems) {
        elems.forEach((elem) => elem.setAttribute("disabled", "true"));
    }

    function unDisabled(...elems) {
        elems.forEach((elem) => elem.removeAttribute("disabled"));
    }

    function displayTime() {
        seconds++;

        if (seconds >= 60) {
            minutes++;
            seconds = 0;

            if (minutes >= 60) {
                hours++;
                minutes = 0;

                if (hours >= 24) {
                    hours = 0;
                }
            }
        }

        let h = hours < 10 ? "0" + hours : hours;
        let m = minutes < 10 ? "0" + minutes : minutes;
        let s = seconds < 10 ? "0" + seconds : seconds;

        stopWatch.innerHTML = `${h} : ${m} : ${s}`;
    }

    startBtn.addEventListener("click", () => {
        if (startTimer !== null) {
            clearInterval(startTimer);
        }

        startTimer = setInterval(displayTime, 1000);

        disabled(startBtn);
        unDisabled(stopBtn, resetBtn);
    });

    stopBtn.addEventListener("click", function () {
        clearInterval(startTimer);

        disabled(stopBtn);
        unDisabled(startBtn);
    });

    resetBtn.addEventListener("click", function () {
        clearInterval(startTimer);

        disabled(resetBtn, stopBtn);
        unDisabled(startBtn);

        [hours, minutes, seconds] = [0, 0, 0];

        stopWatch.innerHTML = "00 : 00 : 00";
    });
});