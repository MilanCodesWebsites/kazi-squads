const SQUAD_BASE_URL = 'https://sandbox-api-d.squadco.com'
const SQUAD_SECRET_KEY = process.env.SQUAD_SECRET_KEY!

export async function initiateTransaction(payload: {
  email: string
  amount: number
  transaction_ref: string
  callback_url: string
  metadata: object
}) {
  const res = await fetch(`${SQUAD_BASE_URL}/transaction/initiate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SQUAD_SECRET_KEY}`
    },
    body: JSON.stringify({
      ...payload,
      currency: 'NGN',
      initiate_type: 'inline'
    })
  })
  return res.json()
}

export async function initiateTransfer(payload: {
  transaction_ref: string
  amount: number
  bank_code: string
  account_number: string
  remark: string
}) {
  const res = await fetch(`${SQUAD_BASE_URL}/payout/initiate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SQUAD_SECRET_KEY}`
    },
    body: JSON.stringify({
      ...payload,
      currency: 'NGN'
    })
  })
  return res.json()
}

export async function getBankList() {
  // Using Paystack for bank list as requested
  const res = await fetch('https://api.paystack.co/bank', {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return res.json()
}
