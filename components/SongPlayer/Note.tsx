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

// Converts letters into numbers ('a' => 0, 'b' => 1)
const alphaVal = (s: string) => s.toLowerCase().charCodeAt(0) - 97 + 1

const NOTE_WIDTH = 25
const NOTE_GAP = 5

const HORIZONTAL_POSITIONS = {
  // A
  0: (NOTE_WIDTH + NOTE_GAP) * 5,
  // B
  1: (NOTE_WIDTH + NOTE_GAP) * 6,
  // C
  2: 0,
  // D
  3: (NOTE_WIDTH + NOTE_GAP),
  // E
  4: (NOTE_WIDTH + NOTE_GAP) * 2,
  // F
  5: (NOTE_WIDTH + NOTE_GAP) * 3,
  // G
  6: (NOTE_WIDTH + NOTE_GAP) * 4,
}


// The small space under the masked window to let things roll into
const GAP = 2;

const Note = ({note, time, id}: Props) => {
    const isNoteOver = note.time + note.duration <= time - GAP;
    const percentDone = note.time - time; 
    const horizontalPosition = alphaVal(note.pitch);
  return (
    <motion.div 
    //animate={{ translateY: isNoteOver ? -300 : 0 }} 
    style={{
        width: `25px`,
        height: `${note.duration * 100}px`,
        backgroundColor: 'blue',
        translateX: `${HORIZONTAL_POSITIONS[horizontalPosition]}px`,
        translateY: `${percentDone * 100}px`,
        position: 'absolute',
        transition: 'translateY 400ms linear',
    }}
    exit={{opacity:0}} />
  )
}

export default Note