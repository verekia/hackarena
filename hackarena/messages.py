# -*- coding: utf-8 -*-
import json
from enum import Enum


class BEMessages(Enum):
    ALL_MAIN_BROADCAST = 'ALL_MAIN_BROADCAST'
    PING_BROADCAST = 'PING_BROADCAST'


class FEMessages(Enum):
    pass


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
