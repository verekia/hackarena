# -*- coding: utf-8 -*-
import json
from enum import Enum


class BEMessages(Enum):
    ALL_MAIN_BROADCAST = 'ALL_MAIN_BROADCAST'


class FEMessages(Enum):
    pass


class AllMainBroadCast(object):

    message_type = BEMessages.ALL_MAIN_BROADCAST

    def __init__(self):
        pass

    def broadcast(self):
        data = {
            'type': self.message_type,
            'content': '',  # TODO: grab message data from class vars
        }

        # TODO: actually broadcast message
        json_content = json.dumps(data, ensure_ascii=False)
        print json_content
