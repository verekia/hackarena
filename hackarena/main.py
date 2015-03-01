# -*- coding: utf-8 -*-
from collections import defaultdict
from hackarena.player import Player
from hackarena.spell import Spell
from hackarena.team import Team
from hackarena.messages import AllMainBroadcast
from hackarena.messages import FEMessages
from hackarena.messages import WelcomeBroadcast
from hackarena.messages import SendChatBroadcast
from hackarena.utilities import Utilities
from hackarena.constants import MAP_TILES_WIDTH
from hackarena.constants import MAP_TILES_HEIGHT
from hackarena.constants import MAP_TILE_SIZE
from hackarena.constants import MAP_OBSTACLES
from hackarena.constants import Spell as SpellConstants
from sockjs.tornado import SockJSConnection
import hackarena.constants
import itertools
import json
import time


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
            return hackarena.constants.DEFAULT_ROOM

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
            if self.teams[self.room]['red'].building_hp <= 0 or self.teams[self.room]['blue'].building_hp <= 0:
                del self.teams[self.room]
                self.broadcast_game_state()

        if data['type'] == FEMessages.FE_SEND_CHAT:
            SendChatBroadcast(
                username=data['content']['username'],
                message=data['content']['message']
            ).broadcast_to_all(self)


    def spell_request(self, spell_type, position_x, position_y, direction):
        if spell_type in self.player.available_spells:
            spell = Spell.create_spell(spell_type, position_x * MAP_TILE_SIZE, position_y * MAP_TILE_SIZE, direction)

            time_since_last_cast = (time.time() - self.player.spell_cast_times[spell_type]) * 1000

            if time_since_last_cast >= spell.cooldown:
                self.spells.append(spell)
                self.calculate_damage(spell)
                self.player.spell_cast_times[spell_type] = time.time()

    def calculate_damage(self, spell):
        for team in self.teams[self.room].values():
            for player in team.players:
                # If we're trying to heal and it's an enemy,
                # or trying to damage and it's a friend, don't do anything
                if (
                    spell.damage < 0 and player.team != self.player.team
                    or spell.damage > 0 and player.team == self.player.team
                ):
                    continue

                if self.calculate_intersection(player, spell):
                    player.hp -= spell.damage
                    if player.hp <= 0:
                        player.reset()
                        if player.team == 'red':
                            self.teams[self.room]['blue'].kills += 1
                        if player.team == 'blue':
                            self.teams[self.room]['red'].kills += 1
                        player.last_death = time.time()
                    elif player.hp > player.MAX_HP:
                        player.hp = player.MAX_HP

        if spell.spell_type != hackarena.constants.Spell.HEALER_HEAL:
            # TODO: check for dead building
            if self.calculate_intersection_with_tower(spell):
                enemy_team = 'red' if self.player.team == 'blue' else 'blue'
                self.teams[self.room][enemy_team].building_hp -= spell.damage

    def calculate_intersection(self, player, spell):
        # Stop hitting yourself!
        if player == self.player:
            return False

        spell_pixels = self.calculate_spell_hit_area(spell)

        return (player.position['x'] * MAP_TILE_SIZE, player.position['y'] * MAP_TILE_SIZE) in spell_pixels

    def calculate_intersection_with_tower(self, spell):
        # No friendly-fire on towers
        enemy_team = 'red' if self.player.team == 'blue' else 'blue'
        t = self.teams[self.room][enemy_team]

        spell_pixels = self.calculate_spell_hit_area(spell)

        # TODO: convert to general-purpose intersection method (using width=1 as default)
        tower_pixels_x = xrange(t.building_position['x'], t.building_position['x'] + t.building_size['width'] + MAP_TILE_SIZE, MAP_TILE_SIZE)
        tower_pixels_y = xrange(t.building_position['y'], t.building_position['y'] + t.building_size['height'] + MAP_TILE_SIZE, MAP_TILE_SIZE)
        for pixel in itertools.product(tower_pixels_x, tower_pixels_y):
            if pixel in spell_pixels:
                return True

        return False

    def calculate_spell_hit_area(self, spell):
        spell_start_x = spell.start_position['x']
        spell_start_y = spell.start_position['y']
        spell_end_x = spell.end_position['x']
        spell_end_y = spell.end_position['y']

        if spell.aoe:
            # TODO: argh, no time to calculate pixels that shouldn't be included
            # just go with a massive square for now :(
            aoe_range = SpellConstants.SPELL_RANGES[spell.spell_type]
            spell_hit_pixels_x = xrange(spell_start_x - aoe_range, spell_start_x + aoe_range + MAP_TILE_SIZE, MAP_TILE_SIZE)
            spell_hit_pixels_y = xrange(spell_start_y - aoe_range, spell_start_y + aoe_range + MAP_TILE_SIZE, MAP_TILE_SIZE)
            hit_pixels = [p for p in itertools.product(spell_hit_pixels_x, spell_hit_pixels_y)]
        else:
            if spell_start_x == spell_end_x:
                y0 = min(spell_start_y, spell_end_y)
                y1 = max(spell_start_y, spell_end_y)
                hit_pixels = [(spell_start_x, y) for y in xrange(y0 + MAP_TILE_SIZE, y1 + MAP_TILE_SIZE, MAP_TILE_SIZE)]
            else:
                x0 = min(spell_start_x, spell_end_x)
                x1 = max(spell_start_x, spell_end_x)
                hit_pixels = [(x, spell_start_y) for x in xrange(x0 + MAP_TILE_SIZE, x1 + MAP_TILE_SIZE, MAP_TILE_SIZE)]

        return hit_pixels

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
