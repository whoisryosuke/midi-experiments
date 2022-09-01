import React from 'react'
import Stack from '../Stack';
import KeyboardKeyWhite from './KeyboardKeyWhite';

type Props = {}

// It's technically 7, but arrays include 0 - so we reduce by 1
const OCTAVES = 7;
const NOTE_LETTERS = ['C','D','E','F','G','A','B']

const KeyboardUI = (props: Props) => {
  const octaves = new Array(OCTAVES).fill(0);
  const notes = octaves.map((_, octave) => NOTE_LETTERS.map((note) => `${note}${octave + 1}`))
  return (
    <Stack>
      {notes.map(octave => octave.map(note => <KeyboardKeyWhite key={note} label={note} />))}
    </Stack>
  )
}

export default KeyboardUI