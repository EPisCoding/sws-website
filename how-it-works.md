# How the Smart Walking Stick Works

The Smart Walking Stick (SWS) is an assistive device designed to help people living with Parkinson's disease manage **Freezing of Gait (FOG)** — a debilitating symptom where the brain sends signals to walk but the feet suddenly fail to respond.

The device addresses this through **multimodal cueing**: delivering three types of sensory signal simultaneously to help the brain re-establish a walking rhythm and initiate movement.

---

## The Three Cueing Modalities

### 🔊 Rhythmic Auditory Stimulation (RAS)

A clear, steady beat is played through a built-in speaker — like a metronome. Research has consistently shown that providing an external auditory rhythm helps the brain lock onto a regular cadence, improving stride length, walking speed and gait regularity in Parkinson's patients.

The beat speed (BPM) is fully adjustable from 60 to 140 beats per minute, allowing the user to match their own natural walking pace.

### 📳 Haptic Vibration Feedback

The handle of the stick vibrates gently in the user's hand in time with the audio beat. This provides a physical, tactile cue that works even in noisy environments or for users with hearing difficulties. For many Parkinson's patients, the combination of auditory and haptic cueing together is more effective than either alone.

### 🔴 Visual Laser Cueing

A laser module projects a visible line onto the floor ahead of the user. Stepping over a clear line on the ground is a well-established technique for helping people initiate movement during a freeze — giving the brain a visual target to aim for. Future iterations will use a **green laser** for improved visibility, following feedback from Parkinson's patients who found it clearer under typical indoor lighting.

---

## The Companion App

All three cueing modalities are controlled wirelessly through a companion **Android smartphone application**, developed using React Native and Expo. The app connects to the stick via **Bluetooth Low Energy (BLE)** and provides:

- **Individual toggles** for each cueing mode
- **BPM slider** to adjust the beat speed in real time
- **Voice control** — hands-free activation of all features using spoken commands such as *"turn on laser"* or *"speed up"*
- **Live gait graph** — real-time visualisation of accelerometer data from the IMU sensor built into the stick
- **Session recording** — walking sessions saved and exportable to share with a physiotherapist or carer
- **Daily diary** — users can log how their walking felt each day, building a personal record alongside the objective sensor data

---

## The Hardware

At the core of the device is a **Raspberry Pi Zero 2W** microcontroller, housed in a custom 3D-printed enclosure mounted to the walking stick. Key components include:

- **MPU6050 IMU** — a six-axis inertial measurement unit capturing real-time accelerometer and gyroscope data
- **MAX98357A I2S amplifier** — driving a 3W 4-ohm speaker for the audio cueing
- **Coin vibration motor** — delivering haptic pulses through the handle
- **Laser module** — projecting the visual floor line
- **UPS HAT** — providing stable, battery-backed 5V power for untethered use
- **Custom PCB** — a compact printed circuit board designed to replace the breadboard prototype, consolidating all connections onto a single board that sits directly on the Pi's GPIO header

---

## Prototype 2

The second prototype moves away from the Raspberry Pi to an **ESP32 microcontroller**, reducing size, cost and power consumption. It also introduces **physical buttons directly on the stick**, allowing users to toggle cueing without needing their phone — making the device more accessible and independent for everyday use.
