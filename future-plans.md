# The Plan — What Comes Next

The Smart Walking Stick prototype has proven the concept works. Real Parkinson's patients have used it, given feedback, and told us they would want something like it in their lives. But this is very much the beginning, not the end.

Here is where the project is headed.

---

## Prototype 2 — Working Without the App

The first prototype required a smartphone app to control all the cueing features. While the app is powerful and gives users a huge amount of flexibility, feedback from Parkinson's patients made one thing clear — not everyone wants to rely on a phone, and in the middle of a freezing episode, reaching for a screen isn't always realistic.

**Prototype 2 moves the controls onto the stick itself.**

By migrating from the Raspberry Pi Zero 2W to an **ESP32 microcontroller**, the device becomes smaller, lighter and cheaper. Physical buttons built directly into the walking stick handle will allow users to toggle the audio beat, vibration and laser on and off without needing their phone at all. The smartphone app will still be available for users who want fine-grained control and session recording — but the device will work completely independently without it.

The custom PCB design developed in Prototype 1 will be refined and adapted for the ESP32, making the hardware more compact and robust.

---

## Clinical Testing

The demonstration with the **Parkinson's UK Southend support group** in April 2026 provided valuable qualitative feedback — but the next step is rigorous, structured clinical testing.

Working through the **MRes at Swansea University**, the plan is to conduct trials measuring quantitative gait parameters with and without cueing — including stride length, cadence and step symmetry — across a cohort of Parkinson's patients. This will build a proper evidence base for the device's effectiveness and provide the kind of data needed to support grant applications, regulatory approval and eventual clinical adoption.

---

## Automated Freezing of Gait Detection

This is the most ambitious and exciting part of the roadmap — and it was actually the most requested feature by the Parkinson's UK group during the demonstration.

Currently the device relies on the user manually activating the cueing when they feel a freeze coming. The vision for the next stage of the project is for the device to **detect a Freezing of Gait episode automatically** and respond without any input needed from the user.

The MPU6050 IMU sensor already built into the stick continuously captures accelerometer and gyroscope data. By collecting labelled gait data — walking normally, walking with FOG — a **machine learning model** can be trained to recognise the characteristic signal patterns of a freezing episode in real time.

Once detected, the device would be able to propose or automatically trigger the appropriate cueing response — audio, haptic or visual — to help the user break the freeze as quickly as possible, even in cases where they are unable to interact with the device manually.

This brings the SWS considerably closer to a truly autonomous assistive device, and represents a meaningful step forward in what technology can offer Parkinson's patients.

---

## Grants and Funding

Developing a medical device properly takes resources. The plan is to pursue funding through several routes:

- **Parkinson's UK Non-Drug Approaches Research Grant** — Parkinson's UK Tech Partnerships have specifically recommended applying to this scheme, which funds research into non-pharmacological interventions for Parkinson's disease. The target is to apply in the next funding round.

- **Innovate UK / Biomedical Catalyst** — for later stage development once clinical evidence is building, these schemes support the translation of research into real products.

- **University research funding** — through the MRes and potential PhD continuation, accessing university and EPSRC research funding to support the clinical trial work.

---

## The Bigger Picture

The long-term goal is straightforward: to turn the Smart Walking Stick into a **clinically validated, affordable assistive device** that can reach the people who need it.

Existing multimodal cueing devices are expensive and inaccessible for many patients. The SWS is being built from the ground up with accessibility and affordability as core design principles — using accessible hardware, open development and a pragmatic approach to cost.

There is a real gap in the market and a real clinical need. The project has already demonstrated that people with Parkinson's respond positively to the device. The next steps are to build the evidence, improve the hardware, and find a path to getting it into the hands of patients — whether through the NHS, Parkinson's charities, or direct to consumers.

This project started with one person in mind. The goal is for it to end up helping many thousands more.
