# -*- coding: utf-8 -*-
from collections import defaultdict
from hackarena.player import Player
from hackarena.team import Team
from hackarena.messages import AllMainBroadcast
from hackarena.messages import FEMessages
from hackarena.messages import WelcomeBroadcast
from hackarena.utilities import Utilities
from hackarena.constants import map_width
from hackarena.constants import map_height
from sockjs.tornado import SockJSConnection
import json


class WebSocketHandler(SockJSConnection):

    clients = defaultdict(dict)
    teams = {}
    players = {}

    def on_open(self, info):
        self.session_string = Utilities.get_session_string(str(self.session))

        self.room = 'lobby'
        self.clients[self.room][self.session_string] = self
        WelcomeBroadcast(message='Welcome to HackArena!').send(self)
        WelcomeBroadcast(message='Welcome to HackArena! (to all)').broadcast_to_all(self)

    def on_close(self):
        player = self.players[self.session_string]
        del self.clients[self.room][self.session_string]
        self.teams[self.room][player.team].remove_player(player)
        del self.players[self.session_string]

        self.broadcast_game_state()

    def on_message(self, message):
        try:
            data = json.loads(message)
        except:
            print 'Received unsupported message type'
            return

        if data['type'] == FEMessages.FE_JOIN_ROOM:
            new_room = data['content']['room']
            self.change_room(new_room)

            if new_room not in self.teams:
                self.teams[new_room] = {
                    'red': Team(),
                    'blue': Team(),
                }

            player = Player(
                username=data['content']['username'],
                character_class=data['content']['characterClass'],
                team=data['content']['team'],
            )
            self.teams[new_room][player.team].add_player(player)
            self.players[self.session_string] = player

            self.broadcast_game_state()

        if data['type'] == FEMessages.FE_HERO_MOVE:
            char_pos_x = self.players[self.session_string]['position']['x']
            char_pos_y = self.players[self.session_string]['position']['y']
            move_allowed, new_pos_x, new_pos_y = self.move_request(char_pos_x, char_pos_y, data['content'].direction)
            self.players[self.session_string]['position']['x'] = new_pos_x
            char_pos_y = self.players[self.session_string]['position']['y'] = new_pos_y
            self.broadcast_game_state()

        print 'Rooms: ' + str(self.clients)

    def change_room(self, room):
        old_room = self.room
        self.room = room

        del self.clients[old_room][self.session_string]
        self.clients[room][self.session_string] = self

    def broadcast_game_state(self):
        AllMainBroadcast(
            teams=self.teams[self.room],
            spells=[],
        ).broadcast_to_all(self)

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
