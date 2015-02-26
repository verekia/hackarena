# -*- coding: utf-8 -*-
import json
from enum import Enum


class BEMessages(Enum):
    ALL_MAIN_BROADCAST = 'ALL_MAIN_BROADCAST'


class FEMessages(Enum):
    FE_PING = 'FE_PING'
    FE_JOIN_ROOM = 'FE_JOIN_ROOM'


class Broadcast(object):

    data = {}

    def __init__(self, *args, **kwargs):
        self.data.update(kwargs)

    def broadcast(self, handler):
        data = {
            'type': self.message_type,
            'content': '',  # TODO: grab message data from class vars
        }

        json_content = json.dumps(data, ensure_ascii=False)
        handler.send(json_content)


class AllMainBroadcast(Broadcast):

    message_type = BEMessages.ALL_MAIN_BROADCAST
