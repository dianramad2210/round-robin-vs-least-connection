from flask import Flask, render_template, jsonify
import random

app = Flask(__name__)

# =====================================
# TERMINAL A (ROUND ROBIN)
# =====================================

rr = {
    "servers": [
        {"id": 0, "name": "Bus A", "active": 0, "total": 0},
        {"id": 1, "name": "Bus B", "active": 0, "total": 0},
        {"id": 2, "name": "Bus C", "active": 0, "total": 0}
    ],
    "queue": [],
    "pointer": 0,
    "logs": [],
    "counter": 0
}

# =====================================
# TERMINAL B (LEAST CONNECTION)
# =====================================

lc = {
    "servers": [
        {"id": 0, "name": "Bus A", "active": 0, "total": 0},
        {"id": 1, "name": "Bus B", "active": 0, "total": 0},
        {"id": 2, "name": "Bus C", "active": 0, "total": 0}
    ],
    "queue": [],
    "logs": [],
    "counter": 0
}

# =====================================
# UTILITIES
# =====================================

def load_diff(servers):

    totals = [s["total"] for s in servers]

    if not totals:
        return 0

    return max(totals) - min(totals)


def reset_rr():

    rr["queue"] = []
    rr["logs"] = []
    rr["pointer"] = 0
    rr["counter"] = 0

    for bus in rr["servers"]:
        bus["active"] = 0
        bus["total"] = 0


def reset_lc():

    lc["queue"] = []
    lc["logs"] = []
    lc["counter"] = 0

    for bus in lc["servers"]:
        bus["active"] = 0
        bus["total"] = 0


# =====================================
# PAGE
# =====================================

@app.route("/")
def home():
    return render_template("index.html")


# =====================================
# ROUND ROBIN
# =====================================

@app.route("/rr/state")
def rr_state():

    return jsonify({
        "servers": rr["servers"],
        "queue": rr["queue"],
        "logs": rr["logs"],
        "dispatch": sum(bus["total"] for bus in rr["servers"]),
        "diff": load_diff(rr["servers"])
    })


@app.route("/rr/add")
def rr_add():

    for _ in range(5):

        rr["counter"] += 1

        rr["queue"].append(
            f"P{rr['counter']}"
        )

    rr["logs"].append(
        "🚏 5 penumpang masuk Terminal A"
    )

    return rr_state()


@app.route("/rr/dispatch")
def rr_dispatch():

    if len(rr["queue"]) == 0:
        return rr_state()

    passenger = rr["queue"].pop(0)

    current = rr["pointer"]

    bus = rr["servers"][current]

    bus["active"] += 1
    bus["total"] += 1

    rr["pointer"] = (
        current + 1
    ) % len(rr["servers"])

    rr["logs"].append(
        f"{passenger} naik {bus['name']}"
    )

    return rr_state()


@app.route("/rr/reset")
def rr_reset():

    reset_rr()

    return rr_state()


# =====================================
# LEAST CONNECTION
# =====================================

@app.route("/lc/state")
def lc_state():

    return jsonify({
        "servers": lc["servers"],
        "queue": lc["queue"],
        "logs": lc["logs"],
        "dispatch": sum(bus["total"] for bus in lc["servers"]),
        "diff": load_diff(lc["servers"])
    })


@app.route("/lc/add")
def lc_add():

    for _ in range(5):

        lc["counter"] += 1

        lc["queue"].append(
            f"P{lc['counter']}"
        )

    lc["logs"].append(
        "🚏 5 penumpang masuk Terminal B"
    )

    return lc_state()


@app.route("/lc/dispatch")
def lc_dispatch():

    if len(lc["queue"]) == 0:
        return lc_state()

    passenger = lc["queue"].pop(0)

    minimum = min(
        bus["active"]
        for bus in lc["servers"]
    )

    candidates = [

        bus

        for bus in lc["servers"]

        if bus["active"] == minimum
    ]

    target = random.choice(candidates)

    target["active"] += 1
    target["total"] += 1

    lc["logs"].append(
        f"{passenger} naik {target['name']}"
    )

    return lc_state()


@app.route("/lc/complete")
def lc_complete():

    available = [

        bus

        for bus in lc["servers"]

        if bus["active"] > 0
    ]

    if available:

        bus = random.choice(available)

        bus["active"] -= 1

        lc["logs"].append(
            f"🚌 Penumpang turun dari {bus['name']}"
        )

    return lc_state()


@app.route("/lc/reset")
def lc_reset():

    reset_lc()

    return lc_state()


# =====================================
# COMPARISON
# =====================================

@app.route("/compare/run")
def compare():

    rr_result = [
        {"name": "Bus A", "total": 0},
        {"name": "Bus B", "total": 0},
        {"name": "Bus C", "total": 0}
    ]

    lc_result = [
        {"id": 0, "name": "Bus A", "active": 0, "total": 0},
        {"id": 1, "name": "Bus B", "active": 0, "total": 0},
        {"id": 2, "name": "Bus C", "active": 0, "total": 0}
    ]

    logs = []

    pointer = 0

    for i in range(15):

        rr_bus = rr_result[pointer]

        rr_bus["total"] += 1

        rr_name = rr_bus["name"]

        pointer = (pointer + 1) % 3

        minimum = min(
            bus["active"]
            for bus in lc_result
        )

        candidates = [

            bus

            for bus in lc_result

            if bus["active"] == minimum
        ]

        target = random.choice(candidates)

        target["active"] += 1
        target["total"] += 1

        lc_name = target["name"]

        logs.append(
            f"P{i+1}: RR → {rr_name} | LC → {lc_name}"
        )

    return jsonify({
        "rr": rr_result,
        "lc": lc_result,
        "logs": logs
    })


# =====================================
# MAIN
# =====================================

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )