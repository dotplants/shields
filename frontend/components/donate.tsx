import React from 'react'
import styled from 'styled-components'

const Donate = styled.div`
  padding: 25px 50px;
`

const Mirror = styled.div`
  font-weight: bold;
`

export default function DonateBox(): JSX.Element {
  return (
    <Donate>
      <Mirror>
        This is a mirror site of{' '}
        <a href="https://shields.io" rel="noopener noreferrer" target="_blank">
          Shields.io
        </a>{' '}
        for @dotplants.
      </Mirror>
      <div>
        Love Shields? Please consider{' '}
        <a href="https://opencollective.com/shields">donating</a> to sustain our
        activities
      </div>
    </Donate>
  )
}
