import pandas as pd
import random
import numpy as np
import plotly.express as px
import streamlit as st

# ---------------------------------
# Page Configuration
# ---------------------------------
st.set_page_config(
    page_title="Quantum Guardian - Hazard Monitor",
    page_icon="☣",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ---------------------------------
# Theme CSS Injection (Quantum Guardian Sci-Fi Theme)
# ---------------------------------
st.markdown("""
<link href="https://fonts.googleapis.com/css2?family=Exo:wght@300;400;600&family=Orbitron:wght@400;600;800;900&family=Rajdhani:wght@500;600;700&display=swap" rel="stylesheet">
<style>
    /* Global Background and Text styles */
    .stApp {
        background-color: #020204;
        color: #ffffff;
        font-family: 'Exo', sans-serif;
    }
    
    body {
        background-color: #020204;
    }

    /* Scrollbars */
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    ::-webkit-scrollbar-track {
        background: #020204;
    }
    ::-webkit-scrollbar-thumb {
        background: rgba(0, 245, 255, 0.2);
        border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: rgba(57, 255, 20, 0.4);
    }

    /* Sidebar Styling */
    [data-testid="stSidebar"] {
        background-color: rgba(4, 10, 20, 0.95);
        border-right: 1px solid rgba(0, 245, 255, 0.15);
    }
    [data-testid="stSidebar"] [class*="css"] {
        color: #ffffff;
    }

    /* Header hides */
    header {visibility: hidden;}
    [data-testid="stHeader"] {background: rgba(0,0,0,0);}
    footer {visibility: hidden;}

    /* Custom Glassmorphism Panels */
    .glass-panel {
        background: rgba(8, 16, 30, 0.65);
        backdrop-filter: blur(12px) saturate(180%);
        border: 1px solid rgba(0, 245, 255, 0.15);
        border-radius: 4px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
    }

    /* Cyber Title Header */
    .cyber-title {
        font-family: 'Orbitron', sans-serif;
        font-weight: 900;
        font-size: 2.2rem;
        letter-spacing: 4px;
        margin-bottom: 5px;
        background: linear-gradient(to right, #ffffff, #00f5ff 60%, #39ff14);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        filter: drop-shadow(0 0 10px rgba(0, 245, 255, 0.15));
    }
    
    .cyber-subtitle {
        font-family: 'Rajdhani', sans-serif;
        color: #00f5ff;
        font-size: 0.95rem;
        letter-spacing: 3px;
        text-transform: uppercase;
        margin-bottom: 30px;
        border-bottom: 1px solid rgba(0, 245, 255, 0.1);
        padding-bottom: 10px;
    }

    /* Custom Metrics Styling */
    .stats-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
        margin-bottom: 25px;
    }
    
    .stat-card {
        background: rgba(8, 16, 30, 0.6);
        border: 1px solid rgba(0, 245, 255, 0.1);
        border-radius: 4px;
        padding: 20px;
        text-align: center;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    }
    
    .stat-card:hover {
        border-color: #00f5ff;
        box-shadow: 0 4px 20px rgba(0, 245, 255, 0.15);
    }
    
    .stat-val {
        font-family: 'Orbitron', sans-serif;
        font-size: 2rem;
        font-weight: 800;
        color: #00f5ff;
        text-shadow: 0 0 10px rgba(0, 245, 255, 0.3);
        margin-bottom: 5px;
    }
    
    .stat-val.high {
        color: #ff2a2a;
        text-shadow: 0 0 10px rgba(255, 42, 42, 0.3);
    }

    .stat-val.warning {
        color: #ffaa00;
        text-shadow: 0 0 10px rgba(255, 170, 0, 0.3);
    }
    
    .stat-lbl {
        font-family: 'Rajdhani', sans-serif;
        color: #8ca3b8;
        font-size: 0.85rem;
        letter-spacing: 1px;
        text-transform: uppercase;
    }

    /* Sci-fi Alert Feed Console */
    .console-box {
        background: rgba(4, 8, 15, 0.8);
        border: 1px solid rgba(0, 245, 255, 0.15);
        border-radius: 4px;
        font-family: 'Consolas', 'Courier New', monospace;
        font-size: 0.8rem;
        height: 250px;
        overflow-y: scroll;
        padding: 15px;
        margin-bottom: 25px;
        box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
    }

    .log-line {
        padding: 4px 8px;
        margin-bottom: 6px;
        border-left: 3px solid transparent;
        border-radius: 2px;
    }

    .log-line.danger {
        background: rgba(255, 42, 42, 0.08);
        border-left-color: #ff2a2a;
        color: #ff6b6b;
    }

    .log-line.warning {
        background: rgba(255, 170, 0, 0.08);
        border-left-color: #ffaa00;
        color: #ffd166;
    }

    .log-line.info {
        background: rgba(0, 245, 255, 0.08);
        border-left-color: #00f5ff;
        color: #80f5ff;
    }

    .log-time {
        color: #6272a4;
        margin-right: 10px;
        font-weight: bold;
    }

    /* Subheaders */
    h3, [class*="stHeader"] h3 {
        font-family: 'Orbitron', sans-serif !important;
        font-size: 1.15rem !important;
        letter-spacing: 2px;
        color: #ffffff;
        margin-bottom: 15px;
        text-transform: uppercase;
        border-left: 3px solid #00f5ff;
        padding-left: 10px;
    }

    /* Streamlit DataFrame custom overlay */
    [data-testid="stTable"] table, [data-testid="stDataFrame"] {
        border: 1px solid rgba(0, 245, 255, 0.15) !important;
        background-color: rgba(5, 12, 24, 0.8) !important;
    }

</style>
""", unsafe_allow_html=True)

# ---------------------------------
# Sidebar Settings / Inputs
# ---------------------------------
st.sidebar.markdown("""
<div style="text-align: center; margin-bottom: 25px;">
    <h3 style="border: none; padding: 0; color: #00f5ff; letter-spacing: 3px;">GUARDIAN HUD</h3>
    <small style="color: #8ca3b8; font-family: 'Rajdhani'; letter-spacing: 1px;">UNIT STATUS: ONLINE</small>
</div>
""", unsafe_allow_html=True)

drone_count = st.sidebar.slider(
    "ACTIVE DRONE FLEET SIZE",
    min_value=50,
    max_value=300,
    value=200,
    step=10
)

variance_factor = st.sidebar.slider(
    "SENSOR VARIANCE MATRIX",
    min_value=0.0,
    max_value=2.0,
    value=1.0,
    step=0.1
)

st.sidebar.markdown("---")
st.sidebar.markdown("""
<div style="font-family: 'Rajdhani'; font-size: 0.8rem; color: #8ca3b8;">
    <div>SYSTEM VERSION: v2.4.5</div>
    <div>CLOUD LINK: SECURE SECURE</div>
    <div>SENSORS ACTIVE: 8/8</div>
</div>
""", unsafe_allow_html=True)

# ---------------------------------
# Header Brand Display
# ---------------------------------
st.markdown('<div class="cyber-title">QUANTUM GUARDIAN</div>', unsafe_allow_html=True)
st.markdown('<div class="cyber-subtitle">☢ Autonomous Nuclear Hazard Monitoring Dashboard</div>', unsafe_allow_html=True)

# ---------------------------------
# Generate Synthetic Drone Data
# ---------------------------------
@st.cache_data
def load_drone_data(count, variance):
    random.seed(42)
    np.random.seed(42)
    data = []

    for i in range(count):
        x = random.randint(0, 100)
        y = random.randint(0, 100)

        # Radiation source simulation (radial decay from center 50,50)
        radiation = max(
            0,
            120 - np.sqrt((x - 50)**2 + (y - 50)**2)
        )
        # Add sensor variance noise
        radiation += np.random.normal(0, 5 * variance)
        radiation = max(0, min(120, radiation))

        # Gas sensor reading (ppm)
        gas = random.uniform(0, 100) + np.random.normal(0, 10 * variance)
        gas = max(0, min(100, gas))

        # Flame sensor (binary detection)
        flame = random.choice([0, 0, 0, 1])

        # Atmospheric pressure (hPa)
        pressure = random.uniform(980, 1020)

        # Gyroscope stability
        gyro = random.uniform(-10, 10)

        # Obstacle distance (m)
        obstacle_distance = random.uniform(1, 20)

        # Thermal temp (°C)
        thermal_temp = random.uniform(20, 120) + np.random.normal(0, 8 * variance)
        thermal_temp = max(20, min(150, thermal_temp))

        thermal_hotspot = False
        if thermal_temp > 80:
            thermal_hotspot = True

        # Dust storm detection
        dust_storm = False
        if pressure < 990 and gas > 60:
            dust_storm = True

        # Risk classification
        danger_level = "LOW"
        if radiation > 70:
            danger_level = "HIGH"
        elif radiation > 40:
            danger_level = "MEDIUM"

        data.append({
            "Drone_ID": i + 100,  # 3-digit military drone label
            "X": x,
            "Y": y,
            "Radiation": round(radiation, 2),
            "Gas": round(gas, 2),
            "Flame": flame,
            "Pressure": round(pressure, 2),
            "Gyroscope": round(gyro, 2),
            "Obstacle_Distance": round(obstacle_distance, 2),
            "Thermal_Temp": round(thermal_temp, 2),
            "Thermal_Hotspot": thermal_hotspot,
            "Dust_Storm_Risk": dust_storm,
            "Danger_Level": danger_level
        })

    return pd.DataFrame(data)

df = load_drone_data(drone_count, variance_factor)

# ==================================================
# System Statistics Grid (HTML themed override)
# ==================================================
avg_rad = round(df["Radiation"].mean(), 2)
high_risk_count = len(df[df["Danger_Level"] == "HIGH"])
hotspot_count = len(df[df["Thermal_Hotspot"] == True])
dust_alerts = len(df[df["Dust_Storm_Risk"] == True])

st.markdown(f"""
<div class="stats-container">
    <div class="stat-card">
        <div class="stat-val">{avg_rad} Sv/h</div>
        <div class="stat-lbl">☢ Average Radiation</div>
    </div>
    <div class="stat-card">
        <div class="stat-val high">{high_risk_count}</div>
        <div class="stat-lbl">⚠️ High Risk Zones</div>
    </div>
    <div class="stat-card">
        <div class="stat-val warning">{hotspot_count}</div>
        <div class="stat-lbl">🌡️ Thermal Hotspots</div>
    </div>
    <div class="stat-card">
        <div class="stat-val">{dust_alerts}</div>
        <div class="stat-lbl">🌪️ Dust Storm Alerts</div>
    </div>
</div>
""", unsafe_allow_html=True)

# ---------------------------------
# Maps Columns
# ---------------------------------
col1, col2 = st.columns(2)

# Custom color scales matching style.css (Cyan/Nuclear Green for Rad, Dark Red/Orange for thermal)
rad_colorscale = [
    [0.0, "rgba(2, 2, 4, 0)"],
    [0.2, "rgba(0, 100, 200, 0.4)"],
    [0.6, "rgba(0, 245, 255, 0.8)"],
    [1.0, "rgba(57, 255, 20, 1.0)"]
]

thermal_colorscale = [
    [0.0, "rgba(2, 2, 4, 0)"],
    [0.3, "rgba(100, 0, 0, 0.4)"],
    [0.7, "rgba(255, 170, 0, 0.8)"],
    [1.0, "rgba(255, 42, 42, 1.0)"]
]

with col1:
    st.markdown('<div class="glass-panel">', unsafe_allow_html=True)
    st.subheader("☢ Radiation Mapping Matrix")

    radiation_fig = px.density_heatmap(
        df,
        x="X",
        y="Y",
        z="Radiation",
        nbinsx=25,
        nbinsy=25,
        color_continuous_scale=rad_colorscale
    )

    radiation_fig.update_layout(
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        font_family="Orbitron",
        font_color="#ffffff",
        xaxis=dict(
            gridcolor='rgba(0, 245, 255, 0.08)',
            title_font=dict(family="Rajdhani", size=14)
        ),
        yaxis=dict(
            gridcolor='rgba(0, 245, 255, 0.08)',
            title_font=dict(family="Rajdhani", size=14)
        ),
        coloraxis_colorbar=dict(
            title="Sv/h",
            title_font=dict(family="Rajdhani", size=12)
        )
    )

    st.plotly_chart(radiation_fig, use_container_width=True)
    st.markdown('</div>', unsafe_allow_html=True)

with col2:
    st.markdown('<div class="glass-panel">', unsafe_allow_html=True)
    st.subheader("🔥 Volumetric Thermal & Fire Map")

    fire_fig = px.density_heatmap(
        df,
        x="X",
        y="Y",
        z="Thermal_Temp",
        nbinsx=25,
        nbinsy=25,
        color_continuous_scale=thermal_colorscale
    )

    fire_fig.update_layout(
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        font_family="Orbitron",
        font_color="#ffffff",
        xaxis=dict(
            gridcolor='rgba(255, 42, 42, 0.08)',
            title_font=dict(family="Rajdhani", size=14)
        ),
        yaxis=dict(
            gridcolor='rgba(255, 42, 42, 0.08)',
            title_font=dict(family="Rajdhani", size=14)
        ),
        coloraxis_colorbar=dict(
            title="°C",
            title_font=dict(family="Rajdhani", size=12)
        )
    )

    st.plotly_chart(fire_fig, use_container_width=True)
    st.markdown('</div>', unsafe_allow_html=True)

# ---------------------------------
# Real-time Alert Console (Themed Log Feed)
# ---------------------------------
st.subheader("🚨 Quantum Guardian Alert Console Feed")

console_html = '<div class="console-box">'
alert_count = 0

for index, row in df.iterrows():
    drone_lbl = f"DRN-{int(row['Drone_ID'])}"
    
    if row["Radiation"] > 80:
        alert_count += 1
        console_html += f'<div class="log-line danger"><span class="log-time">[ALRT_{alert_count}]</span>☣ RADIATION LEVEL CRITICAL near {drone_lbl}: {row["Radiation"]} Sv/h (Exceeding max containment parameters)</div>'
        
    if row["Flame"] == 1:
        alert_count += 1
        console_html += f'<div class="log-line danger"><span class="log-time">[ALRT_{alert_count}]</span>🔥 COMBUSTION DETECTED: thermal node link on {drone_lbl} indicates open flame source</div>'

    if row["Thermal_Hotspot"] and not row["Flame"] == 1:
        alert_count += 1
        console_html += f'<div class="log-line warning"><span class="log-time">[ALRT_{alert_count}]</span>🌡️ THERMAL hotspot signature tracked near {drone_lbl}: {row["Thermal_Temp"]}°C</div>'

    if row["Dust_Storm_Risk"]:
        alert_count += 1
        console_html += f'<div class="log-line info"><span class="log-time">[ALRT_{alert_count}]</span>🌪️ CLOUD DEBRIS HAZARD: dust storm storm-front reading near {drone_lbl} (Gas sensor density high, pressure dropping)</div>'

if alert_count == 0:
    console_html += '<div class="log-line info" style="color: #39ff14;"><span class="log-time">[STATUS]</span>ALL DANGER INDICES NOMINAL. Trajectory superposition stable.</div>'

console_html += '</div>'
st.markdown(console_html, unsafe_allow_html=True)

# ---------------------------------
# Raw Telemetry DataFrame Grid
# ---------------------------------
st.subheader("📡 Active Drone Telemetry Matrix")

# Style dataframe headers
styled_df = df.style.format({
    "Radiation": "{:.2f}",
    "Gas": "{:.2f}",
    "Pressure": "{:.2f}",
    "Gyroscope": "{:.2f}",
    "Obstacle_Distance": "{:.2f}",
    "Thermal_Temp": "{:.2f}"
})

st.dataframe(
    styled_df,
    use_container_width=True,
    height=400
)
