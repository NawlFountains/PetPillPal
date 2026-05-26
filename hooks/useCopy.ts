import * as Clipboard from 'expo-clipboard'
import { useState } from 'react'

export function useCopy() {
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const handleCopy = async (code: string, familyId: string) => {
        await Clipboard.setStringAsync(code)
        setCopiedId(familyId)
        setTimeout(() => setCopiedId(null), 2000)
    }

    return { copiedId, handleCopy }
}