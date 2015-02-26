from tornado.ioloop import IOLoop
from tornado.web import RequestHandler, Application, url, StaticFileHandler
from tornado.options import define, options
from sockjs.tornado import SockJSRouter, SockJSConnection


class WebSocketHandler(SockJSConnection):
    clients = {
        'lobby': {},
    }

    def on_open(self, info):
        pass

    def on_close(self):
        pass

    def on_message(self, message):
        pass


##############################################
#                                            #
#                 App Setup                  #
#                                            #
##############################################

define('port', default=8888, help="run on the given port", type=int)
define('address', default='192.168.X.X', help="run on the address", type=str)

class IndexHandler(RequestHandler):
    def get(self, room):
        self.render('index.html')

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
