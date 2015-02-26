# -*- coding: utf-8 -*-
from hackarena.messages import PingBroadcast
from sockjs.tornado import SockJSConnection


class WebSocketHandler(SockJSConnection):
    clients = {
        'lobby': {},
    }

    def on_open(self, info):
        PingBroadcast(foo='bar').broadcast_to_all(self)

    def on_close(self):
        pass

    def on_message(self, message):
        print message
