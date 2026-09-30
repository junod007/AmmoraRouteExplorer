import { createServer } from 'node:http'
import { AmmoraRouteClient } from '@ammora-protocol/sdk'
import { ammoraPools } from './pools.ts'

console.log('Starting Ammora API server...')
console.log('Loaded pools:', ammoraPools.length)

const ammora = await AmmoraRouteClient.create({
  chainId: 91342,
  verificationBlock: 36220000n,
  pools: ammoraPools,
})

console.log('AmmoraRouteClient ready')

function serialize(value: unknown): unknown {
  if (typeof value === 'bigint') {
    return value.toString()
  }

  if (Array.isArray(value)) {
    return value.map(serialize)
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        serialize(item),
      ]),
    )
  }

  return value
}

const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const url = new URL(
    req.url ?? '/',
    `http://${req.headers.host ?? 'localhost:3001'}`,
  )

  if (url.pathname === '/api/health') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
    })

    res.end(
      JSON.stringify({
        ok: true,
        chainId: 91342,
        pools: ammoraPools.length,
      }),
    )

    return
  }

  if (url.pathname === '/api/quote') {
    try {
      const tokenIn = url.searchParams.get('tokenIn')
      const tokenOut = url.searchParams.get('tokenOut')
      const amountIn = url.searchParams.get('amountIn')

      if (!tokenIn || !tokenOut || !amountIn) {
        res.writeHead(400, {
          'Content-Type': 'application/json',
        })

        res.end(
          JSON.stringify({
            error: 'tokenIn, tokenOut and amountIn are required',
          }),
        )

        return
      }

      const quote = await ammora.quoteExactIn({
        tokenIn: tokenIn as `0x${string}`,
        tokenOut: tokenOut as `0x${string}`,
        amountIn: BigInt(amountIn),
      })

      res.writeHead(200, {
        'Content-Type': 'application/json',
      })

      res.end(JSON.stringify(serialize(quote)))

      return
    } catch (error) {
      console.error('Quote error:', error)

      res.writeHead(500, {
        'Content-Type': 'application/json',
      })

      res.end(
        JSON.stringify({
          error: String(error),
        }),
      )

      return
    }
  }

  res.writeHead(404, {
    'Content-Type': 'application/json',
  })

  res.end(
    JSON.stringify({
      error: 'Not found',
    }),
  )
})

server.listen(3001, () => {
  console.log('Ammora API running at http://localhost:3001')
})