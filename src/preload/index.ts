import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

if (!process.contextIsolated) {
    throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
    contextBridge.exposeInMainWorld('context', {
        // TODO: Add your own API methods here
    })
} catch (error) {
    console.error(error)
}
