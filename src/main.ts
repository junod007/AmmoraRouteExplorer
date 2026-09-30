import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="app">
    <header class="header">
      <div>
        <p class="eyebrow">GIWA SEPOLIA</p>
        <h1>Ammora Route Explorer</h1>
        <p class="subtitle">
          Preview real Ammora routes and quotes.
        </p>
      </div>
    </header>

    <section class="card">
      <div class="card-header">
        <div>
          <h2>Get Quote</h2>
          <p>Request a quote through the Ammora API.</p>
        </div>

        <span id="status" class="status">Ready</span>
      </div>

      <div class="form">
        <label>
          Token In
          <input
            id="tokenIn"
            type="text"
            value="0x4200000000000000000000000000000000000006"
          />
        </label>

        <label>
          Token Out
          <input
            id="tokenOut"
            type="text"
            value="0x9976F3d67D3D73619EEd90e9e2eb2F6c765F47da"
          />
        </label>

        <label>
          Amount In
          <input
            id="amountIn"
            type="text"
            value="1000000000000000"
          />
        </label>

        <button id="quote" type="button">
          Get Quote
        </button>
      </div>

      <div id="result" class="result">
        <p>No quote requested yet.</p>
      </div>
    </section>
  </main>
`

const quoteButton =
  document.querySelector<HTMLButtonElement>('#quote')!

const status =
  document.querySelector<HTMLSpanElement>('#status')!

const result =
  document.querySelector<HTMLDivElement>('#result')!

const tokenInInput =
  document.querySelector<HTMLInputElement>('#tokenIn')!

const tokenOutInput =
  document.querySelector<HTMLInputElement>('#tokenOut')!

const amountInInput =
  document.querySelector<HTMLInputElement>('#amountIn')!

quoteButton.addEventListener('click', async () => {
  try {
    quoteButton.disabled = true
    status.textContent = 'Quoting...'

    result.innerHTML = `
      <p>Requesting quote from Ammora...</p>
    `

    const params = new URLSearchParams({
      tokenIn: tokenInInput.value.trim(),
      tokenOut: tokenOutInput.value.trim(),
      amountIn: amountInInput.value.trim(),
    })

    const response = await fetch(
      `http://localhost:3001/api/quote?${params.toString()}`,
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error ?? 'Quote request failed')
    }

    status.textContent = 'Quote Ready'

    const hop = data.hops?.[0]

    result.innerHTML = `
      <div class="quote-grid">
        <div>
          <span>Provider</span>
          <strong>${data.providerId}</strong>
        </div>

        <div>
          <span>Expected Output</span>
          <strong>${data.expectedAmountOut}</strong>
        </div>

        <div>
          <span>Minimum Output</span>
          <strong>${data.minimumAmountOut}</strong>
        </div>

        <div>
          <span>Fee</span>
          <strong>${data.fees.total}</strong>
        </div>

        <div>
          <span>Pool Model</span>
          <strong>${hop?.model ?? '—'}</strong>
        </div>

        <div>
          <span>Pool</span>
          <strong>${hop?.pool ?? '—'}</strong>
        </div>
      </div>
    `
  } catch (error) {
    console.error(error)

    status.textContent = 'Error'

    result.innerHTML = `
      <p>Failed to get quote.</p>
      <pre>${String(error)}</pre>
    `
  } finally {
    quoteButton.disabled = false
  }
})