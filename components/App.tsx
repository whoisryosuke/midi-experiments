import React, { useState } from 'react'
import KeyboardUI from './KeyboardUI/KeyboardUI'
import MIDIKeyboard from './MIDIKeyboard'

type Props = {}

const App = (props: Props) => {
  const [playing, setPlaying] = useState<boolean>(true)
  return (
    <div>
        <KeyboardUI />
        <MIDIKeyboard playing={playing} />
    </div>
  )
}

export default App