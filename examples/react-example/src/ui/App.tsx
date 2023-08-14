import React, { useState, useCallback } from 'react'
import { frontApiUrl, clientId, clientSecret } from '../utility/config'
import { FrontComponent } from './Front'
import { FrontPayload } from '@front-finance/link'
import { FrontApi } from '@front-finance/api'
import DynamicForm, { FormValues } from './DynamicForm'

export const App: React.FC = () => {
  const [iframeLink, setIframeLink] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [payload, setPayload] = useState<FrontPayload | null>(null)
  const [tagetAddresses, setTargetAddresses] = useState<FormValues>({
    toAddresses: []
  })

  console.log(tagetAddresses)

  const getAuthLink = useCallback(async () => {
    setError(null)
    setIframeLink(null)
    const api = new FrontApi({
      baseURL: frontApiUrl,
      headers: {
        'x-client-id': clientId, // insert your client id here
        'x-client-secret': clientSecret // do not use your clientSecret on the FE
      }
    })

    // this request should be performed from the backend side
    const response = await api.managedAccountAuthentication.v1CataloglinkCreate(
      tagetAddresses,
      {
        UserId: '7652B44F-9CDB-4519-AC82-4FA5500F7455', // insert your unique user identifier here
        CallbackUrl: window.location.href, // insert your callback URL here
        EnableTransfers: true
      }
    )

    const data = response.data
    if (response.status !== 200 || !data?.content) {
      const error = (data && data.message) || response.statusText
      console.error('Error!', error)
      setError(error)
    } else if (!data.content.iFrameUrl) {
      setError('Iframe url is empty')
    } else {
      setIframeLink(data.content.iFrameUrl)
    }
  }, [tagetAddresses])

  return (
    <div style={{ padding: '15px' }}>
      {(payload && (
        <div style={{ wordWrap: 'break-word' }}>
          <h1>Connected!</h1>
          <p>
            <b>Broker:</b> {payload.accessToken?.brokerName}
            <br />
            <b>Token:</b> {payload.accessToken?.accountTokens[0].accessToken}
            <br />
            <b>Refresh Token:</b>{' '}
            {payload.accessToken?.accountTokens[0].refreshToken}
            <br />
            <b>Token expires in seconds:</b>{' '}
            {payload.accessToken?.expiresInSeconds}
            <br />
            <b>ID:</b> {payload.accessToken?.accountTokens[0].account.accountId}
            <br />
            <b>Name: </b>
            {payload.accessToken?.accountTokens[0].account.accountName}
            <br />
            <b>Cash:</b> ${payload.accessToken?.accountTokens[0].account.cash}
            <br />
          </p>
        </div>
      )) || (
        <p>
          No accounts connected recently! Please press the button below to use
          Front and authenticate
        </p>
      )}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <button style={{ width: '50%' }} onClick={getAuthLink}>
          Front Broker Connection
        </button>
      </div>
      <br />
      <br />
      <h2>Target addresses</h2>
      <DynamicForm setOutput={setTargetAddresses} />

      <FrontComponent
        iframeLink={iframeLink}
        onSuccess={(authData: FrontPayload) => {
          setPayload(authData)
          setIframeLink(null)
        }}
        onExit={err => {
          setIframeLink(null)
          setError(err || null)
        }}
      />
    </div>
  )
}

export default App
