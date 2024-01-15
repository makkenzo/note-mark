import { appDirectoryName, fileEncoding } from '@shared/constants'
import { NoteInfo } from '@shared/models'
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import { dialog } from 'electron'
import { ensureDir, readFile, readdir, remove, stat, writeFile } from 'fs-extra'
import { homedir } from 'os'
import path from 'path'

export const getRootDir = () => {
    return `${homedir()}\\${appDirectoryName}`
}

export const getNotes: GetNotes = async () => {
    const rootDir = getRootDir()

    await ensureDir(rootDir)

    const notesFileNames = await readdir(rootDir, {
        encoding: fileEncoding,
        withFileTypes: false,
    })

    const notes = notesFileNames.filter((fileName) => fileName.endsWith('.md'))

    return Promise.all(notes.map(getNoteInfoFromFilename))
}

export const getNoteInfoFromFilename = async (filename: string): Promise<NoteInfo> => {
    const fileStats = await stat(`${getRootDir()}/${filename}`)

    return {
        title: filename.replace(/\.md$/, ''),
        lastEditTime: fileStats.mtimeMs,
    }
}

export const readNote: ReadNote = async (filename) => {
    const rootDir = getRootDir()

    return await readFile(`${rootDir}/${filename}.md`, { encoding: fileEncoding })
}

export const writeNote: WriteNote = async (filename, content) => {
    const rootDir = getRootDir()

    // console.info(`Writing note ${filename} to ${rootDir}`)
    console.info(`[WRITE NOTE] ${filename} [TO] ${rootDir}`)
    return writeFile(`${rootDir}/${filename}.md`, content, { encoding: fileEncoding })
}

export const createNote: CreateNote = async () => {
    const rootDir = getRootDir()

    await ensureDir(rootDir)

    const { filePath, canceled } = await dialog.showSaveDialog({
        title: 'Create a new note',
        defaultPath: `${rootDir}/Untitled.md`,
        buttonLabel: 'Create',
        properties: ['showOverwriteConfirmation'],
        showsTagField: false,
        filters: [{ name: 'Markdown', extensions: ['md'] }],
    })

    if (canceled || !filePath) {
        console.info('[CREATE NOTE] Canceled')
        return false
    }

    const { name: filename, dir: parentDir } = path.parse(filePath)

    if (parentDir !== rootDir) {
        await dialog.showMessageBox({
            type: 'error',
            title: 'Creation failed',
            message: `All notes must be created in ${rootDir}. Please move the note there and try again.`,
        })

        return false
    }

    console.info(`[CREATE NOTE] ${filePath}`)
    await writeFile(filePath, '')

    return filename
}

export const deleteNote: DeleteNote = async (filename) => {
    const rootDir = getRootDir()

    const { response } = await dialog.showMessageBox({
        type: 'warning',
        title: 'Delete note',
        message: `Are you sure you want to delete ${filename}?`,
        buttons: ['Delete', 'Cancel'],
        defaultId: 1,
        cancelId: 1,
    })

    if (response === 1) {
        console.info('[DELETE NOTE] Canceled')
        return false
    }

    console.info(`[DELETE NOTE] ${filename}`)
    await remove(`${rootDir}/${filename}.md`)
    return true
}
