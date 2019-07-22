const fs = require('fs')
const Module = require('module')
const { join } = require('path')

const ws = require('ws')

const wss = new ws.Server({ port: 3432 })
const aiFile = join(__dirname,'ai.js')
const evalAi = code => {
  const mod = new Module(aiFile, module.parent)
  mod._compile(code, aiFile)
  return mod.exports
}

const handle = async buffer => {
  const context = JSON.parse(buffer)
  context.rand = rand(String(context.seed))
  const { buildContext, ai } = evalAi(await fs.promises.readFile(aiFile, 'utf-8'))

  return { context: { ...context, ...buildContext(context) }, ai }
}

const logErr = fn => async arg => {
  try { await fn(arg) } catch (err) { console.log(err) }
}

wss.on('connection', logErr(async ws => {
  const { ai, context } = await new Promise((s, r) =>
    ws.once('message', buffer => s(handle(buffer))))

  ws.send(new TextEncoder().encode(context.name))
  ws.on('message', async buffer => {
    if (!context) {
      context = JSON.parse(buffer)
      let seed = Number(context.seed)
      context.rand = () => (2**32-1 & (seed = Math.imul(16807, seed))) / 2**32
      buildContext(context)
      ws.send(new TextEncoder().encode(context.name))
      return
    }
    let i = -1
    const players = Array(context.count).fill().map(() => ({}))
    while (++i < context.count) {
      const x = i * 2
      const y = x + 1

      if (i == context.index) {
        players[0].x = buffer[x]
        players[0].y = buffer[y]
      } else if (i > context.index) {
        players[i].x = buffer[x]
        players[i].y = buffer[y]
      } else {
        players[i+1].x = buffer[x]
        players[i+1].y = buffer[y]
      }
    }

    try {
      ws.send(new Uint8Array([await ai(context, players)]))
    } catch (err) {
      console.log(err)
      ws.send(new Uint8Array([0xFF]))
    }
  })
}))