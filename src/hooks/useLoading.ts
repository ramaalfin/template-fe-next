import { useState, useCallback } from 'react'

const useLoading = () => {
  const [loading, setLoading] = useState(false)

  const withLoading = useCallback(async (asyncFunc: () => Promise<void>) => {
    setLoading(true)

    try {
      await asyncFunc()
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, withLoading }
}

export default useLoading
