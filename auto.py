from pynput import mouse, keyboard
import threading
import time

from pynput.mouse import Controller as MouseController
from pynput.keyboard import Key, Listener

mouse = MouseController()
running = False


def move_mouse():
    v = 10
    while True:
        if running:
            mouse.move(v, 0)  # move 10px para direita
            v = -v
        time.sleep(0.05)

def on_press(key):
    global running
    try:
        if key == Key.num_lock:
            running = not running  # alterna estado
        elif key == Key.esc:
            return False  # encerra listener
    except AttributeError:
        pass

threading.Thread(target=move_mouse, daemon=True).start()

with Listener(on_press=on_press) as listener:
    listener.join()