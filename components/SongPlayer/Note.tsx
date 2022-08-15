import { motion } from 'framer-motion'
import React from 'react'
import { Note as MidiNote } from '@tonejs/midi/dist/Note';
import { FRAME_HEIGHT_TIME } from '../../utils/constants';

type Props = {
    note: MidiNote;
    time: number;
    id: number;
}
// BEGINNING: Current Time
// END: Current Time + FRAME_HEIGHT_TIME
// PERCENT = NOTE TIME - Current Time
FRAME_HEIGHT_TIME


// The small space under the masked window to let things roll into
const GAP = 2;

const Note = ({note, time, id}: Props) => {
    const isNoteOver = note.time + note.duration <= time - GAP;
    const percentDone = note.time - time; 
  return (
    <motion.div 
    //animate={{ translateY: isNoteOver ? -300 : 0 }} 
    style={{
        width: `25px`,
        height: `${note.duration * 100}px`,
        backgroundColor: 'blue',
        translateX: `${id * 25 + (10 * id)}px`,
        translateY: `${percentDone * 100}px`,
        position: 'absolute',
        transition: 'translateY 400ms linear',
    }}
    exit={{opacity:0}} />
  )
}

export default Note