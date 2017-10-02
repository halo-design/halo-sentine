import React from 'react'
import LazyLoader from './LazyLoader'
import Loading from './Loading'

const Bumper = ({ compnent }) => (
  <LazyLoader load={compnent}>
    {Bumper => Bumper ? <Bumper /> : <Loading />}
  </LazyLoader>
)

export default Bumper
