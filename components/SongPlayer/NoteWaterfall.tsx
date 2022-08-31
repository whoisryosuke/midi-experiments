import React from 'react'
import { Note as MidiNote } from '@tonejs/midi/dist/Note';
import Note from './Note';
import { AnimatePresence } from 'framer-motion';

type Props = {
    notes: MidiNote[]
    time: number;

}

const NoteWaterfall = ({notes, time}: Props) => {
  return (
    <div>
      <ul style={{display: 'flex', listStyle: 'none', padding: 0, textAlign: 'center', }}>
        <li
    style={{
        width: `25px`, marginRight: '5px',
    }}>C</li>
        <li
    style={{
        width: `25px`, marginRight: '5px',
    }}>D</li>
        <li
    style={{
        width: `25px`, marginRight: '5px',
    }}>E</li>
        <li
    style={{
        width: `25px`, marginRight: '5px',
    }}>F</li>
        <li
    style={{
        width: `25px`, marginRight: '5px',
    }}>G</li>
        <li
    style={{
        width: `25px`, marginRight: '5px',
    }}>A</li>
        <li
    style={{
        width: `25px`, marginRight: '5px',
    }}>B</li>
      </ul>
    <div style={{position:'relative', borderBottom: '2px solid white'}}>
    <AnimatePresence>
        {notes.map((note, id) => <Note key={`${note.name}-${note.time}`} note={note} time={time} id={id} />)}
    </AnimatePresence></div></div>
  )
}

export default NoteWaterfall