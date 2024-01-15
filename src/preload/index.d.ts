import { GetNotes, ReadNote, WriteNote, CreateNote } from '@shared/types'

declare global {
    interface Window {
        // electron: ElectronAPI
        context: {
            locale: string
            getNotes: GetNotes
            readNote: ReadNote
            writeNote: WriteNote
            createNote: CreateNote
        }
    }
}
