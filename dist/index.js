'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

var _stream = require('stream');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var koaDevMiddleware = function koaDevMiddleware(compiler, opts, callback) {
  if (!options.dev.publicPath) {
    var publicPath = compiler.options.output.publicPath;

    if (!publicPath) {
      throw new Error('publicPath must be set on `dev` options or in compiler\'s `output` configuration.');
    }

    options.dev.publicPath = publicPath;
  }
  var expressMiddleware = (0, _webpackDevMiddleware2.default)(compiler, opts);
  if (callback) {
    expressMiddleware.waitUntilValid(callback);
  }
  return function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return expressMiddleware(ctx.req, {
                end: function end(content) {
                  ctx.body = content;
                },
                setHeader: function setHeader(name, value) {
                  ctx.set(name, value);
                }
              }, next);

            case 2:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
};

var koaHotMiddleware = function koaHotMiddleware(compiler, opts) {
  var expressMiddleware = (0, _webpackHotMiddleware2.default)(compiler, opts);
  return function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx, next) {
      var stream;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              stream = new _stream.PassThrough();

              ctx.body = stream;
              _context2.next = 4;
              return expressMiddleware(ctx.req, {
                write: stream.write.bind(stream),
                writeHead: function writeHead(status, headers) {
                  ctx.status = status;
                  ctx.set(headers);
                }
              }, next);

            case 4:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }();
};

exports.default = { koaDevMiddleware: koaDevMiddleware, koaHotMiddleware: koaHotMiddleware };