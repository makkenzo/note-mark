import { ActionButton } from '@/components'
import { LuFileSignature } from 'react-icons/lu'

import type { ActionButtonProps } from '@/components'

export const NewNoteButton = ({ ...props }: ActionButtonProps) => {
    return (
        <ActionButton {...props}>
            <LuFileSignature className="w-4 h-4 text-zinc-300" />
        </ActionButton>
    )
}
