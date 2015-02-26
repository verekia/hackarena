# -*- coding: utf-8 -*-


class Utilities(object):

    @classmethod
    def get_session_string(cls, original_session_string):
        session_attributes = original_session_string.split(' ')
        return session_attributes[0] + ' ' + session_attributes[1]

    @classmethod
    def get_session_middle_part(cls, original_session_string):
        return original_session_string.split(' ')[1]
