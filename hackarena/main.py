# -*- coding: utf-8 -*-
from collections import defaultdict
from hackarena.player import Player
from hackarena.team import Team
from hackarena.messages import AllMainBroadcast
from hackarena.messages import FEMessages
from hackarena.messages import WelcomeBroadcast
from hackarena.utilities import Utilities
from sockjs.tornado import SockJSConnection
import json


class WebSocketHandler(SockJSConnection):

    clients = defaultdict(dict)
    teams = {}

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

            AllMainBroadcast(
                teams=self.teams[self.room],
                spells=[],
            ).broadcast_to_all(self)

        print 'Rooms: ' + str(self.clients)

    def change_room(self, room):
        old_room = self.room
        self.room = room

        del self.clients[old_room][self.session_string]
        self.clients[room][self.session_string] = self
