import { useCallback, useState } from 'react'
import type { FeedbackVariant } from '../types/ui'

export const useFeedback = () => {
  const [message, setMessage] = useState('')
  const [variant, setVariant] = useState<FeedbackVariant>('neutral')

  const updateFeedback = useCallback(
    (nextMessage: string, nextVariant: FeedbackVariant = 'neutral') => {
      setMessage(nextMessage)
      setVariant(nextVariant)
    },
    [],
  )

  const resetFeedback = useCallback(() => {
    setMessage('')
    setVariant('neutral')
  }, [])

  return {
    message,
    variant,
    updateFeedback,
    resetFeedback,
  }
}
