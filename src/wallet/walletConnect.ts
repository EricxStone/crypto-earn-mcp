import { SignClient } from '@walletconnect/sign-client'
import QRCode from 'qrcode'

export class WalletConnect {
  public async connect (): Promise<string> {
    const signClient = await SignClient.init({
      projectId: '4d2bc36566f4c25122864c28f8026cc1',
      relayUrl: 'wss://relay.walletconnect.com',
      metadata: {
        name: 'Crypto Earn MCP',
        description: 'Crypto Earn MCP',
        url: 'https://crypto-earn-mcp.com',
        icons: ['https://crypto-earn-mcp.com/logo.png']
      }
    })

    const { uri } = await signClient.connect({
      optionalNamespaces: {
        eip155: {
          methods: [
            'eth_sendTransaction',
            'eth_signTransaction',
            'eth_sign',
            'personal_sign',
            'eth_signTypedData'
          ],
          chains: ['eip155:1'],
          events: ['chainChanged', 'accountsChanged']
        }
      }
    })

    if (uri === undefined) {
      return ''
    }

    return await this.getQRCode(uri)
    // return uri
  }

  private async getQRCode (uri: string): Promise<string> {
    const qrcodeImg = await QRCode.toDataURL(uri, {
      errorCorrectionLevel: 'L',
      version: 11,
      margin: 0,
      type: 'image/png'
    })
    return qrcodeImg
  }
}
