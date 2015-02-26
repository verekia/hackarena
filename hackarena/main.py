# -*- coding: utf-8 -*-
from sockjs.tornado import SockJSConnection


class WebSocketHandler(SockJSConnection):
    clients = {
        'lobby': {},
    }

    def on_open(self, info):
        pass

    def on_close(self):
        pass

    def on_message(self, message):
        print message
