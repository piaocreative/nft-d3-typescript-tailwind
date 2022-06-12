import React from 'react'

interface ILoadingContext {
  loading: boolean
  setLoading?: (val: boolean) => void
}

const defaultState = {
  loading: true,
}

export const LoadingContext = React.createContext<ILoadingContext>(defaultState)
