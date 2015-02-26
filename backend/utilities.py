# -*- coding: utf-8 -*-


class Utilities(object):
    def get_session_string(self, original_session_string):
        session_attributes = original_session_string.split(' ')
        return session_attributes[0] + ' ' + session_attributes[1]

    def get_session_middle_part(self, original_session_string):
        return original_session_string.split(' ')[1]

    def generate_random_name(self, original_session_string):
        # Should get improved
        return self.get_session_middle_part(original_session_string)
