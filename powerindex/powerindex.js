const constants = {
    MEN: {
        "50 Free": { a: -0.0001121071, b: 0.061821918, c: 19.44 },
        "100 Free": { a: -0.0002517676, b: 0.136744618, c: 42.89 },
        "200 Free": { a: -0.0005572378, b: 0.300618098, c: 94.19 },
        "500 Free": { a: -0.0015259468, b: 0.820294698, c: 256.89 },
        "1000 Free": { a: -0.0031876096, b: 1.711715418, c: 535.99 },
        "1650 Free": { a: -0.0053074777, b: 2.848946358, c: 892.04 },
        "100 Back": { a: -0.0002731624, b: 0.148222138, c: 46.49 },
        "200 Back": { a: -0.0006041875, b: 0.325804878, c: 102.09 },
        "100 Breast": { a: -0.000310009, b: 0.167988978, c: 52.69 },
        "200 Breast": { a: -0.000678475, b: 0.365657378, c: 114.59 },
        "100 Fly": { a: -0.0002707852, b: 0.146946858, c: 46.09 },
        "200 Fly": { a: -0.0006136963, b: 0.330905998, c: 103.69 },
        "100 IM": { a: -0.0002773225, b: 0.150453878, c: 47.19 },
        "200 IM": { a: -0.000619045, b: 0.333775378, c: 104.59 },
        "400 IM": { a: -0.0013423081, b: 0.721779318, c: 226.09 }
    },
    WOMEN: {
        "50 Free": { a: -0.0001262429, b: 0.0710661, c: 22.1374875 },
        "100 Free": { a: -0.0002810849, b: 0.1546441, c: 48.277351 },
        "200 Free": { a: -0.0006155909, b: 0.3351981, c: 104.746998 },
        "500 Free": { a: -0.0016545689, b: 0.8960001, c: 280.141539 },
        "1000 Free": { a: -0.0034228409, b: 1.8504481, c: 578.650894 },
        "1650 Free": { a: -0.0057043964, b: 3.0819476, c: 963.8100395 },
        "100 Back": { a: -0.0003047249, b: 0.1674041, c: 52.267751 },
        "200 Back": { a: -0.0006681899, b: 0.3635891, c: 113.625638 },
        "100 Breast": { a: -0.0003484589, b: 0.1910101, c: 59.649991 },
        "200 Breast": { a: -0.0007603859, b: 0.4133531, c: 129.188198 },
        "100 Fly": { a: -0.0003035429, b: 0.1667661, c: 52.068231 },
        "200 Fly": { a: -0.0006800099, b: 0.3699691, c: 115.620838 },
        "100 IM": { a: -0.0003082709, b: 0.1693181, c: 52.866311 },
        "200 IM": { a: -0.0006835559, b: 0.3718831, c: 116.219398 },
        "400 IM": { a: -0.0014731319, b: 0.7980671, c: 249.509732 }
    }
};

function triggerConfetti() {
    confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
    });
}

document.getElementById("power-index-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const gender = document.getElementById("gender").value;
    const selectedEvent = document.getElementById("event").value;
    const minutes = parseInt(document.getElementById("minutes").value) || 0;
    const seconds = parseInt(document.getElementById("seconds").value) || 0;
    const milliseconds = parseInt(document.getElementById("milliseconds").value) || 0;

    if (!constants[gender] || !constants[gender][selectedEvent]) {
        document.getElementById("result").innerText = `ERROR.`;
        return;
    }

    const inputTime = minutes * 60 + seconds + milliseconds / 100;

    const { a, b, c } = constants[gender][selectedEvent];

    const discriminant = Math.pow(b, 2) - 4 * a * (c - inputTime);

    if (discriminant < 0) {
        document.getElementById("result").innerText = `NO REAL SOLUTION FOR ${selectedEvent} (${gender}) WITH TIME ${inputTime.toFixed(2)} SECONDS.`;
        return;
    }

    const xValue = (-b + Math.sqrt(discriminant)) / (2 * a);

    document.getElementById("result").innerText = `RESULT FOR ${selectedEvent} (${gender}): POWER INDEX = ${xValue.toFixed(2)}`;

    triggerConfetti();
});
