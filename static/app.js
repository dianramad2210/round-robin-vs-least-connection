// ======================================
// SIMULATION SPEED
// ======================================

let simulationSpeed = 1000;

// ======================================
// UTILITIES
// ======================================

function serverCard(server) {

    let total = server.total || 0;

    let percent = (total / 20) * 100;

    if (percent > 100) {
        percent = 100;
    }

    return `
        <div class="server-card">

            <h5>🚌 ${server.name}</h5>

            <p>
                Kursi Terisi :
                <strong>${server.active ?? server.total}</strong>
            </p>

            <p>
                Total Penumpang :
                <strong>${server.total}</strong>
            </p>

            <div class="progress">

                <div class="progress-bar"
                     role="progressbar"
                     style="width:${percent}%">

                </div>

            </div>

        </div>
    `;
}

function renderQueue(elementId, queue) {

    let html = "";

    if (queue.length === 0) {

        html = `
            <span class="text-muted">
                Tidak ada penumpang menunggu
            </span>
        `;
    }
    else {

        queue.forEach(item => {

            html += `
                <span class="badge bg-secondary badge-request">
                    ${item}
                </span>
            `;
        });
    }

    document.getElementById(elementId).innerHTML = html;
}

function renderLogs(elementId, logs) {

    const logElement = document.getElementById(elementId);

    logElement.innerHTML = logs.join("<br>");

    logElement.scrollTop = logElement.scrollHeight;
}

// ======================================
// TERMINAL A
// ======================================

async function loadRR() {

    const response = await fetch("/rr/state");
    const data = await response.json();

    document.getElementById("rrServers").innerHTML =
        data.servers.map(serverCard).join("");

    document.getElementById("rrDispatch").innerText =
        data.dispatch;

    document.getElementById("rrDiff").innerText =
        data.diff;

    document.getElementById("rrQueueCount").innerText =
        data.queue.length;

    renderQueue("rrQueue", data.queue);

    renderLogs("rrLogs", data.logs);
}

async function rrAddPassengers() {

    await fetch("/rr/add");

    loadRR();
}

async function rrReset() {

    stopRRAuto();

    await fetch("/rr/reset");

    loadRR();
}

// ======================================
// TERMINAL B
// ======================================

async function loadLC() {

    const response = await fetch("/lc/state");
    const data = await response.json();

    document.getElementById("lcServers").innerHTML =
        data.servers.map(serverCard).join("");

    document.getElementById("lcDispatch").innerText =
        data.dispatch;

    document.getElementById("lcDiff").innerText =
        data.diff;

    document.getElementById("lcQueueCount").innerText =
        data.queue.length;

    renderQueue("lcQueue", data.queue);

    renderLogs("lcLogs", data.logs);
}

async function lcAddPassengers() {

    await fetch("/lc/add");

    loadLC();
}

async function lcReset() {

    stopLCAuto();

    await fetch("/lc/reset");

    loadLC();
}

// ======================================
// MONITORING
// ======================================

async function runComparison() {

    const response =
        await fetch("/compare/run");

    const data =
        await response.json();

    document.getElementById("compareRR").innerHTML =
        data.rr.map(serverCard).join("");

    document.getElementById("compareLC").innerHTML =
        data.lc.map(serverCard).join("");

    renderLogs(
        "compareLogs",
        data.logs
    );
}

// ======================================
// AUTO TERMINAL A
// ======================================

let rrAutoInterval = null;

function rrAuto() {

    const btn =
        document.getElementById("rrAutoBtn");

    if (rrAutoInterval !== null) {

        stopRRAuto();
        return;
    }

    btn.innerText = "⏹ Stop";

    btn.classList.remove("btn-success");

    btn.classList.add("btn-danger");

    rrAutoInterval = setInterval(
        async () => {

            const state =
                await fetch("/rr/state");

            const data =
                await state.json();

            if (data.queue.length === 0) {

                await fetch("/rr/add");
            }

            await fetch("/rr/dispatch");

            loadRR();

        },
        simulationSpeed
    );
}

function stopRRAuto() {

    clearInterval(rrAutoInterval);

    rrAutoInterval = null;

    const btn =
        document.getElementById("rrAutoBtn");

    if (btn) {

        btn.innerText = "▶ Start";

        btn.classList.remove("btn-danger");

        btn.classList.add("btn-success");
    }
}

// ======================================
// AUTO TERMINAL B
// ======================================

let lcAutoInterval = null;

function lcAuto() {

    const btn =
        document.getElementById("lcAutoBtn");

    if (lcAutoInterval !== null) {

        stopLCAuto();
        return;
    }

    btn.innerText = "⏹ Stop";

    btn.classList.remove("btn-success");

    btn.classList.add("btn-danger");

    lcAutoInterval = setInterval(
        async () => {

            const state =
                await fetch("/lc/state");

            const data =
                await state.json();

            if (data.queue.length === 0) {

                await fetch("/lc/add");
            }

            await fetch("/lc/dispatch");

            await fetch("/lc/complete");

            loadLC();

        },
        simulationSpeed
    );
}

function stopLCAuto() {

    clearInterval(lcAutoInterval);

    lcAutoInterval = null;

    const btn =
        document.getElementById("lcAutoBtn");

    if (btn) {

        btn.innerText = "▶ Start";

        btn.classList.remove("btn-danger");

        btn.classList.add("btn-success");
    }
}

// ======================================
// RESET ALL
// ======================================

async function resetAll() {

    stopRRAuto();

    stopLCAuto();

    await fetch("/rr/reset");

    await fetch("/lc/reset");

    loadRR();

    loadLC();

    document.getElementById(
        "compareRR"
    ).innerHTML = "";

    document.getElementById(
        "compareLC"
    ).innerHTML = "";

    document.getElementById(
        "compareLogs"
    ).innerHTML = "";
}

// ======================================
// SPEED CONTROL
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const slider =
            document.getElementById(
                "speedSlider"
            );

        const label =
            document.getElementById(
                "speedLabel"
            );

        if (!slider) return;

        slider.addEventListener(
            "input",
            () => {

                simulationSpeed =
                    parseInt(slider.value);

                if (simulationSpeed <= 1000) {

                    label.innerText = "⚡ Cepat";
                }
                else if (
                    simulationSpeed <= 2000
                ) {

                    label.innerText = "🚍 Normal";
                }
                else {

                    label.innerText = "🐢 Lambat";
                }

                if (rrAutoInterval) {

                    stopRRAuto();
                }

                if (lcAutoInterval) {

                    stopLCAuto();
                }
            }
        );
    }
);

// ======================================
// PAGE LOAD
// ======================================

window.onload = function () {

    loadRR();

    loadLC();
};