# -*- coding: utf-8 -*-
from collections import defaultdict
from hackarena.player import Player
from hackarena.spell import Spell
from hackarena.team import Team
from hackarena.messages import AllMainBroadcast
from hackarena.messages import FEMessages
from hackarena.messages import WelcomeBroadcast
from hackarena.utilities import Utilities
from hackarena.constants import MAP_TILES_WIDTH
from hackarena.constants import MAP_TILES_HEIGHT
from hackarena.constants import MAP_OBSTACLES
from sockjs.tornado import SockJSConnection
import json
import time


DEFAULT_ROOM = 'lobby'


class WebSocketHandler(SockJSConnection):

    clients = defaultdict(dict)
    teams = {}
    players = {}
    spells = []

    @property
    def player(self):
        return self.players[self.session_string]

    @player.setter
    def player(self, player):
        self.players[self.session_string] = player

    @property
    def room(self):
        try:
            return self.player.room
        except:
            return DEFAULT_ROOM

    @room.setter
    def room(self, room):
        self.player.room = room

    def on_open(self, info):
        self.session_string = Utilities.get_session_string(str(self.session))

        self.clients[self.room][self.session_string] = self
        WelcomeBroadcast(message='Welcome to HackArena!').send(self)
        WelcomeBroadcast(message='Welcome to HackArena! (to all)').broadcast_to_all(self)

    def on_close(self):
        self.teams[self.room][self.player.team].remove_player(self.player)

        self.broadcast_game_state()

        del self.players[self.session_string]
        del self.clients[self.room][self.session_string]

    def on_message(self, message):
        try:
            data = json.loads(message)
        except:
            print 'Received unsupported message type'
            return

        if data['type'] == FEMessages.FE_JOIN_ROOM:
            new_room = data['content']['room']
            self.player = Player(
                username=data['content']['username'],
                character_class=data['content']['characterClass'],
                team=data['content']['team'],
            )

            self.change_room(new_room)

            if new_room not in self.teams:
                self.teams[new_room] = {
                    'red': Team('red'),
                    'blue': Team('blue'),
                }

            self.teams[new_room][self.player.team].add_player(self.player)
            self.broadcast_game_state()

        if data['type'] == FEMessages.FE_HERO_MOVE:
            char_pos_x = self.player.position['x']
            char_pos_y = self.player.position['y']
            move_allowed, new_pos_x, new_pos_y = self.move_request(char_pos_x, char_pos_y, data['content']['direction'])
            self.player.position['x'] = new_pos_x
            char_pos_y = self.player.position['y'] = new_pos_y
            self.broadcast_game_state()

        if data['type'] == FEMessages.FE_HERO_SPELL:
            content = data['content']
            self.spell_request(content['spell_type'], content['position_x'], content['position_y'], content['direction'])
            self.broadcast_game_state()
            del self.spells[:]

    def spell_request(self, spell_type, position_x, position_y, direction):
        # TODO: add check for cooldowns etc.
        if spell_type in self.player.available_spells:
            spell = Spell.create_spell(spell_type, position_x, position_y, direction)
            self.spells.append(spell)
            self.calculate_damage(spell)

    def calculate_damage(self, spell):
        for team in self.teams[self.room].values():
            for player in team.players:
                if self.calculate_intersection(player, spell):
                    # TODO: different spell damages
                    player.hp -= 5
                    if player.hp <= 0:
                        player.reset()
                        player.last_death = time.time()

    def calculate_intersection(self, player, spell):
        # Stop hitting yourself!
        if player == self.player:
            return False

        player_x = player.position['x']
        player_y = player.position['y']
        spell_start_x = spell.start_position['x']
        spell_start_y = spell.start_position['y']
        spell_end_x = spell.end_position['x']
        spell_end_y = spell.end_position['y']
        return bool(
            (spell.direction == 'DOWN' and spell_start_y < player_y * 16 < spell_end_y and player_x * 16 == spell_start_x)
            or (spell.direction == 'UP' and spell_start_y > player_y * 16 > spell_end_y and player_x * 16 == spell_start_x)
            or (spell.direction == 'RIGHT' and spell_start_x < player_x * 16 < spell_end_x and player_y * 16 == spell_start_y)
            or (spell.direction == 'LEFT' and spell_start_x > player_x * 16 > spell_end_x and player_y * 16 == spell_start_y)
        )

    def change_room(self, room):
        old_room = self.room
        self.room = room

        del self.clients[old_room][self.session_string]
        self.clients[room][self.session_string] = self

    def broadcast_game_state(self):
        AllMainBroadcast(
            teams=self.teams[self.room],
            spells=self.spells,
        ).broadcast_to_all(self)

    def move_request(self, char_pos_x, char_pos_y, direction):
        if (
            char_pos_x <= 0 and direction == 'LEFT' or
            char_pos_x >= MAP_TILES_WIDTH - 1 and direction == 'RIGHT' or
            char_pos_y <= 0 and direction == 'UP' or
            char_pos_y >= MAP_TILES_HEIGHT - 1 and direction == 'DOWN' or
            self.has_obstacle_there(char_pos_x, char_pos_y, direction)
        ):
            return False, char_pos_x, char_pos_y

        new_position_x = char_pos_x
        new_position_y = char_pos_y

        if (direction == 'LEFT'):
            new_position_x = new_position_x - 1
        elif (direction == 'RIGHT'):
            new_position_x = new_position_x + 1
        elif (direction == 'UP'):
            new_position_y = new_position_y - 1
        elif (direction == 'DOWN'):
            new_position_y = new_position_y + 1

        return True, new_position_x, new_position_y

    def has_obstacle_there(self, char_pos_x, char_pos_y, direction):
        if (
            direction == 'LEFT' and MAP_OBSTACLES[63 * char_pos_y + char_pos_x - 1] != 0 or
            direction == 'RIGHT' and MAP_OBSTACLES[63 * char_pos_y + char_pos_x + 1] != 0 or
            direction == 'DOWN' and MAP_OBSTACLES[63 * char_pos_y + char_pos_x + 63] != 0 or
            direction == 'UP' and MAP_OBSTACLES[63 * char_pos_y + char_pos_x - 63] != 0
        ):
            return True
        return False
