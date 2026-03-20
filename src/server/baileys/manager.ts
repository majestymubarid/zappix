import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  WASocket,
  AnyMessageContent,
} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import path from 'path'
import fs from 'fs'

const SESSIONS_PATH = process.env.SESSIONS_PATH || './storage/sessions'

class WhatsAppManager {
  private connections = new Map<string, WASocket>()
  private qrCallbacks = new Map<string, (qr: string) => void>()
  private statusCallbacks = new Map<string, (status: string) => void>()

  async connect(numberId: string): Promise<WASocket> {
    if (this.connections.has(numberId)) {
      return this.connections.get(numberId)!
    }

    const sessionDir = path.join(SESSIONS_PATH, numberId)
    fs.mkdirSync(sessionDir, { recursive: true })

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir)
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
      version,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, console as any),
      },
      printQRInTerminal: false,
      generateHighQualityLinkPreview: true,
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
      if (qr) {
        const cb = this.qrCallbacks.get(numberId)
        if (cb) cb(qr)
      }

      if (connection === 'close') {
        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut

        this.connections.delete(numberId)
        const statusCb = this.statusCallbacks.get(numberId)
        if (statusCb) statusCb(shouldReconnect ? 'reconnecting' : 'disconnected')

        if (shouldReconnect) {
          setTimeout(() => this.connect(numberId), 5000)
        }
      }

      if (connection === 'open') {
        const statusCb = this.statusCallbacks.get(numberId)
        if (statusCb) statusCb('connected')
      }
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {
      for (const msg of messages) {
        if (!msg.key.fromMe && msg.message) {
          // Route to bot handler — implemented in Phase 10
          console.log('Incoming message on', numberId, 'from', msg.key.remoteJid)
        }
      }
    })

    this.connections.set(numberId, sock)
    return sock
  }

  onQR(numberId: string, callback: (qr: string) => void) {
    this.qrCallbacks.set(numberId, callback)
  }

  onStatus(numberId: string, callback: (status: string) => void) {
    this.statusCallbacks.set(numberId, callback)
  }

  async sendMessage(numberId: string, jid: string, content: AnyMessageContent) {
    const sock = await this.connect(numberId)
    return sock.sendMessage(jid, content)
  }

  async postStatus(numberId: string, content: AnyMessageContent, viewers: string[]) {
    const sock = await this.connect(numberId)
    return sock.sendMessage('status@broadcast', content, {
      statusJidList: viewers,
    })
  }

  async disconnect(numberId: string) {
    const sock = this.connections.get(numberId)
    if (sock) {
      await sock.logout()
      this.connections.delete(numberId)
    }
  }

  isConnected(numberId: string): boolean {
    return this.connections.has(numberId)
  }
}

// Singleton — one manager for the whole app
export const waManager = new WhatsAppManager()
