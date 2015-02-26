# -*- coding: utf-8 -*-
from hackarena.messages import WelcomeBroadcast
from sockjs.tornado import SockJSConnection


class WebSocketHandler(SockJSConnection):
    clients = {
        'lobby': {},
    }

    def on_open(self, info):
        WelcomeBroadcast(message='Welcome to HackArena!').send(self)

    def on_close(self):
        pass

    def on_message(self, message):
        print message
