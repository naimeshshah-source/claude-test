#!/usr/bin/env python3
"""
PiCar-X Autonomous Journey
SunFounder PiCar-X robotics program that:
  1. Drives forward and scans the right side for a face
  2. Greets the detected person via speech
  3. Watches for traffic signs (red=stop, green=go, left arrow=turn, stop sign=end)
  4. Announces activities via TTS throughout the journey
"""

import time
import sys
from picarx import Picarx
from vilib import Vilib
from robot_hat import TTS

# ── Constants ────────────────────────────────────────────────────────────────
SPEED_NORMAL    = 30        # forward drive speed (0-100)
SPEED_TURN      = 20        # speed while turning
TURN_ANGLE      = 30        # steering servo angle for left turn
TURN_DURATION   = 2.0       # seconds to hold a turn
INITIAL_DRIVE   = 3.0       # seconds to drive before first face scan

# Camera pan: negative = right, positive = left  (per SunFounder convention)
CAM_PAN_RIGHT   = -30       # pan angle to look right
CAM_PAN_CENTER  =  0
CAM_TILT_CENTER =  0

# Colour-detection targets  (vilib accepts colour name strings)
RED_COLOR       = "red"
GREEN_COLOR     = "green"

# Sign-shape labels as returned by vilib object detection
SIGN_LEFT_TURN  = "left"    # adjust to match your trained model label
SIGN_STOP       = "stop"    # adjust to match your trained model label

# Detection confidence / size thresholds
FACE_MIN_WIDTH  = 40        # pixels – ignore tiny false positives
COLOR_MIN_AREA  = 500       # px² – minimum blob area to count as a sign

# ── Helpers ──────────────────────────────────────────────────────────────────

def say(tts: TTS, text: str) -> None:
    """Speak text and print it to the console."""
    print(f"[SPEECH] {text}")
    tts.say(text)


def face_detected() -> bool:
    """Return True when vilib sees a face large enough to be real."""
    p = Vilib.face_obj_parameter
    # vilib stores detected face width in the parameter dict
    w = p.get("w", 0) if isinstance(p, dict) else 0
    return Vilib.detect_obj_parameter.get("face_n", 0) > 0 and w >= FACE_MIN_WIDTH


def color_visible(color_name: str) -> bool:
    """Return True when the requested colour blob is large enough."""
    p = Vilib.color_obj_parameter
    area = p.get("area", 0) if isinstance(p, dict) else 0
    detected = Vilib.detect_obj_parameter.get("color", "") == color_name
    return detected and area >= COLOR_MIN_AREA


def sign_detected(label: str) -> bool:
    """Return True when vilib's object detector sees the given sign label."""
    p = Vilib.detect_obj_parameter
    return p.get("label", "").lower() == label.lower()


# ── Main journey ─────────────────────────────────────────────────────────────

def main() -> None:
    px  = Picarx()
    tts = TTS()

    # ── Initialise camera and vision ─────────────────────────────────────────
    Vilib.camera_start(vflip=False, hflip=False)
    Vilib.display(local=False, web=True)   # stream to web interface
    time.sleep(1)                           # let camera warm up

    # Enable detectors we need throughout the run
    Vilib.face_detect_switch(True)
    Vilib.color_detect(RED_COLOR)           # start watching for red

    # Reset camera to centre
    px.set_cam_pan_angle(CAM_PAN_CENTER)
    px.set_cam_tilt_angle(CAM_TILT_CENTER)
    time.sleep(0.5)

    say(tts, "Starting journey. Initialising all systems.")

    try:
        # ── Phase 1: Drive forward for a few seconds ─────────────────────────
        say(tts, "Moving forward. Scanning for faces on the right side.")
        px.forward(SPEED_NORMAL)
        time.sleep(INITIAL_DRIVE)

        # ── Phase 2: Scan right side for a face ──────────────────────────────
        say(tts, "Tilting camera to the right to look for a face.")
        px.set_cam_pan_angle(CAM_PAN_RIGHT)
        px.stop()                           # pause while scanning
        time.sleep(0.5)

        scan_timeout = 10.0                 # give up after 10 s if no face
        scan_start   = time.time()
        face_found   = False

        while time.time() - scan_start < scan_timeout:
            if face_detected():
                face_found = True
                break
            time.sleep(0.1)

        if face_found:
            say(tts, "Face detected! Hello there, how are you?")
        else:
            say(tts, "No face found on the right side. Continuing journey.")

        # ── Return camera to centre and resume driving ────────────────────────
        say(tts, "Returning camera to centre position.")
        px.set_cam_pan_angle(CAM_PAN_CENTER)
        px.set_cam_tilt_angle(CAM_TILT_CENTER)
        time.sleep(0.5)

        say(tts, "Resuming forward drive. Watching for traffic signs.")
        px.forward(SPEED_NORMAL)

        # Switch colour detector to red (sign watching)
        Vilib.color_detect(RED_COLOR)

        # ── Phase 3: Traffic-sign state machine ──────────────────────────────
        # States: driving | stopped_red | turning_left | finished
        state = "driving"

        while state != "finished":
            time.sleep(0.1)     # polling interval

            # ── Red sign → stop ───────────────────────────────────────────
            if state == "driving" and color_visible(RED_COLOR):
                state = "stopped_red"
                px.stop()
                say(tts, "Red sign detected. Stopping and waiting.")

            # ── Stopped at red: watch for green ───────────────────────────
            elif state == "stopped_red":
                Vilib.color_detect(GREEN_COLOR)
                if color_visible(GREEN_COLOR):
                    state = "driving"
                    Vilib.color_detect(RED_COLOR)
                    say(tts, "Green sign detected. Proceeding forward.")
                    px.forward(SPEED_NORMAL)

            # ── Driving: check for left-turn sign ─────────────────────────
            elif state == "driving" and sign_detected(SIGN_LEFT_TURN):
                state = "turning_left"
                say(tts, "Left turn sign detected. Turning left now.")
                px.set_dir_servo_angle(-TURN_ANGLE)     # negative = left
                px.forward(SPEED_TURN)
                time.sleep(TURN_DURATION)
                px.set_dir_servo_angle(0)               # straighten
                px.forward(SPEED_NORMAL)
                state = "driving"
                say(tts, "Turn complete. Continuing forward.")

            # ── Driving: check for stop sign ──────────────────────────────
            elif state == "driving" and sign_detected(SIGN_STOP):
                state = "finished"
                px.stop()
                say(tts, "Stop sign detected. This is the end of the journey. Goodbye!")

    except KeyboardInterrupt:
        say(tts, "Journey interrupted by operator.")

    finally:
        # Safe shutdown
        px.stop()
        px.set_cam_pan_angle(CAM_PAN_CENTER)
        px.set_cam_tilt_angle(CAM_TILT_CENTER)
        Vilib.face_detect_switch(False)
        Vilib.camera_close()
        print("[INFO] Shutdown complete.")


if __name__ == "__main__":
    main()
