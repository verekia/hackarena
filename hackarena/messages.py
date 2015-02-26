# -*- coding: utf-8 -*-
import json


class BEMessages(object):
    ALL_MAIN_BROADCAST = 'ALL_MAIN_BROADCAST'
    PING_BROADCAST = 'PING_BROADCAST'
    WELCOME_BROADCAST = 'BE_WELCOME_BROADCAST'


class FEMessages(object):
    FE_PING = 'FE_PING'
    FE_JOIN_ROOM = 'FE_JOIN_ROOM'
    FE_HERO_MOVE = 'FE_HERO_MOVE'


class Broadcast(object):

    data = {}

    def __init__(self, *args, **kwargs):
        self.data.update(kwargs)

    def _get_message_repr(self):
        data = {
            'type': self.message_type,
            'content': self.data,  # TODO: grab message data from class vars
        }

        return json.dumps(data, ensure_ascii=False)

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
