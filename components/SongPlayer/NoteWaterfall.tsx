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
    <div style={{position:'relative'}}>
    <AnimatePresence>
        {notes.map((note, id) => <Note key={`${note.name}-${note.time}`} note={note} time={time} id={id} />)}
    </AnimatePresence></div>
  )
}

export default NoteWaterfall