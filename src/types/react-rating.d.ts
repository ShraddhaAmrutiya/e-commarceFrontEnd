declare module 'react-rating' {
  import React from 'react'
  export interface RatingProps {
    initialRating?: number
    fractions?: number
    onChange?: (value: number) => void
    emptySymbol?: React.ReactNode
    fullSymbol?: React.ReactNode
    placeholderSymbol?: React.ReactNode
  }
  const Rating: React.ComponentType<RatingProps>
  export default Rating
}