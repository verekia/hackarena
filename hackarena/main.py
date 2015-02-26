# -*- coding: utf-8 -*-
from collections import defaultdict
from hackarena.messages import FEMessages
from hackarena.messages import WelcomeBroadcast
from hackarena.utilities import Utilities
from hackarena.constants import map_width
from hackarena.constants import map_height
from sockjs.tornado import SockJSConnection
import json


class WebSocketHandler(SockJSConnection):

    clients = defaultdict(dict)

    def on_open(self, info):
        self.session_string = Utilities.get_session_string(str(self.session))

        self.room = 'lobby'
        self.clients[self.room][self.session_string] = self
        WelcomeBroadcast(message='Welcome to HackArena!').send(self)
        WelcomeBroadcast(message='Welcome to HackArena! (to all)').broadcast_to_all(self)

    def on_close(self):
        pass

    def on_message(self, message):
        try:
            data = json.loads(message)
        except:
            print 'Received unsupported message type'
            return

        if data['type'] == FEMessages.FE_JOIN_ROOM:
            self.change_room(data['content'])

        if data['type'] == FEMessages.FE_HERO_MOVE:
            #char_pos_x = ~~ data['content'].name ~~ position_x
            #char_pos_y = ~~ data['content'].name ~~ position_y
            # move_allowed, new_pos_x, new_pos_y = self.move_request(char_pos_x, char_pos_y, data['content'].direction)
            # if move_allowed, assign new coordinates and broadcast
            pass

        print 'Rooms: ' + str(self.clients)

    def change_room(self, room):
        old_room = self.room
        self.room = room

        del self.clients[old_room][self.session_string]
        self.clients[room][self.session_string] = self

    def move_request(self, char_pos_x, char_pos_y, direction):
        if (
            char_pos_x <= 0 and direction == 'LEFT' or
            char_pos_x >= map_width - 1 and direction == 'RIGHT' or
            char_pos_y <= 0 and direction == 'UP' or
            char_pos_y >= map_height - 1 == 'DOWN'
        ):
            return False, -1, -1

        new_position_x = char_pos_x
        new_position_y = char_pos_y

        if (direction == 'LEFT'):
            new_position_x = new_position_x - 1
        elif (direction == 'RIGHT'):
            new_position_x = new_position_x + 1
        elif (direction == 'UP'):
            new_position_x = new_position_y - 1
        elif (direction == 'DOWN'):
            new_position_x = new_position_y + 1

        return True, new_position_x, new_position_y
