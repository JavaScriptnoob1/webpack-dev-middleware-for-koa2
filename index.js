import devMiddleware from 'webpack-dev-middleware'
import hotMiddleware from 'webpack-hot-middleware'
import { PassThrough } from 'stream'

const koaDevMiddleware = (compiler, options, callback) => {
  if (!options.publicPath) {
    let publicPath = compiler.options.output.publicPath;

    if (!publicPath) {
      throw new Error('publicPath must be set on options or in compiler\'s `output` configuration.');
    }

    options.publicPath = publicPath;
  }
  const expressMiddleware = devMiddleware(compiler, options)
  if (callback) {
    expressMiddleware.waitUntilValid(callback)
  }
  return async (ctx, next) => {
    await expressMiddleware(ctx.req, {
      end: (content) => {
        ctx.body = content
      },
      setHeader: (name, value) => {
        ctx.set(name, value)
      }
    }, next)
  }
}

const koaHotMiddleware = (compiler, options) => {
  const expressMiddleware = hotMiddleware(compiler, options)
  return async (ctx, next) => {
    let stream = new PassThrough()
    ctx.body = stream
    await expressMiddleware(ctx.req, {
      write: stream.write.bind(stream),
      writeHead: (status, headers) => {
        ctx.status = status
        ctx.set(headers)
      }
    }, next)
  }
}

module.exports = { koaDevMiddleware, koaHotMiddleware }
