from tornado.ioloop import IOLoop
from tornado.web import RequestHandler, Application, url, StaticFileHandler
from tornado.options import define, options
from sockjs.tornado import SockJSRouter, SockJSConnection
import json


class WebSocketHandler(SockJSConnection):
    clients = {
        'lobby': {},
    }

    def on_open(self, info):
        # Required because the last part of the 3-part session string varies on on_close
        # str(self.session): 1416760865.178006 bmv6q4zu 1416760865
        # self.sessionString: 1416760865.178006 bmv6q4zu
        # self.temporaryName: bmv6q4zu
        self.sessionString = getSessionString(str(self.session))
        self.temporaryName = generateRandomName(str(self.session))

        self.clients['lobby'][self.sessionString] = self


    def on_close(self):
        del self.clients[self.room][getSessionString(str(self.session))]
        self.refresh_users()


    def refresh_users(self):
        room_users = [self.getName(value) for key, value in self.clients[self.room].items()]
        self.broadcast([value for key, value in self.clients[self.room].items()], createMessage('USERS', room_users))


    def getName(self, obj=None):
        if obj:
            return obj.chosenName if hasattr(obj, 'chosenName') else obj.temporaryName
        else:
            return self.chosenName if hasattr(self, 'chosenName') else self.temporaryName

    def broadcast_to_all(self, message):
        self.broadcast([value for key, value in self.clients[self.room].items()], message)



    def on_message(self, message):
        try:
            data = json.loads(message)
        except:
            self.send(createMessage('SIMPLE_MESSAGE', 'Unsupported message type.'))
            print 'Received unsupported message type'
            return

        ##############################################
        #                                            #
        #    Backend Events Handling, core logic     #
        #                                            #
        ##############################################

        if data['type'] == 'ROOM':
            self.room = data['content']

            if self.clients['lobby'][self.sessionString]:
                del self.clients['lobby'][self.sessionString]

            try:
                self.clients[self.room][self.sessionString] = self
            except:
                self.clients[self.room] = {}
                self.clients[self.room][self.sessionString] = self

            self.send(createMessage('ENTERED_ROOM', {'roomName':self.room, 'temporaryName': self.temporaryName}))

            self.broadcast_to_all(createMessage('OTHER_ENTERED_ROOM', self.getName()))
            self.refresh_users()

        elif data['type'] == 'NAME':
            old_name = self.getName()
            self.chosenName = data['content']

            self.broadcast_to_all(createMessage('USER_RENAME', {'previousName': old_name, 'newName': self.chosenName}))
            self.refresh_users()

        elif data['type'] == 'USER_MESSAGE':
            self.broadcast_to_all(createMessage('USER_MESSAGE', {'username': self.getName(), 'message': data['content']}))

        else:
            self.send(createMessage('MESSAGE', 'Unsupported message type.'))
            print 'Received unsupported message type'


##############################################
#                                            #
#                 App Setup                  #
#                                            #
##############################################

define('port', default=8888, help="run on the given port", type=int)
define('address', default='192.168.X.X', help="run on the address", type=str)

class IndexHandler(RequestHandler):
    def get(self, room):
        self.render("index.html")

def make_app():
    sock_router = SockJSRouter(WebSocketHandler, '/websocket')
    return Application(
        sock_router.urls +
        [
            (r'/static/(.*)', StaticFileHandler, {'path': 'static'}),
            url(r'/(.*)', IndexHandler),
        ]
    )

def main():
    app = make_app()
    app.listen(options.port) #, options.address)
    IOLoop.current().start()

if __name__ == '__main__':
    options.parse_config_file('server.conf')
    main()
