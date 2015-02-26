# -*- coding: utf-8 -*-
import json


class BEMessages(object):
    ALL_MAIN_BROADCAST = 'BE_ALL_MAIN_BROADCAST'
    PING_BROADCAST = 'PING_BROADCAST'
    WELCOME_BROADCAST = 'BE_WELCOME_BROADCAST'


class FEMessages(object):
    FE_PING = 'FE_PING'
    FE_JOIN_ROOM = 'FE_JOIN_ROOM'
    FE_HERO_MOVE = 'FE_HERO_MOVE'
    FE_HERO_SPELL = 'FE_HERO_SPELL'


class Broadcast(object):

    def __init__(self, *args, **kwargs):
        self.data = kwargs

    def _get_message_repr(self):
        data = {
            'type': self.message_type,
            'content': self.data,
        }

        return json.dumps(data, ensure_ascii=False, default=lambda x: x.__dict__)

    def send(self, handler):
        handler.send(self._get_message_repr())

    def broadcast_to_all(self, handler):
        handler.broadcast(
            handler.clients[handler.room].values(),
            self._get_message_repr(),
        )


class AllMainBroadcast(Broadcast):

    message_type = BEMessages.ALL_MAIN_BROADCAST


class PingBroadcast(Broadcast):

    message_type = BEMessages.PING_BROADCAST


class WelcomeBroadcast(Broadcast):

    message_type = BEMessages.WELCOME_BROADCAST
