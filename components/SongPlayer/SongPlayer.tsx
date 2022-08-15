import { Track } from '@tonejs/midi';
import { Note } from '@tonejs/midi/dist/Note';
import React, { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'
import { FRAME_HEIGHT_TIME } from '../../utils/constants';
import NoteWaterfall from './NoteWaterfall';

type Props = {
    playing: boolean;
    track: Track;
}

const SongPlayer = ({playing, track}: Props) => {
    const [currentTime, setCurrentTime] = useState(new Date())
    const initialTime = useRef<Date | null>(null)
    console.log('track', track)
    // Did we hit last note? Stop! 
    const lastNote = track.notes[track.notes.length - 1];
    // Current seconds of song
    const songDuration = initialTime.current ? (currentTime - initialTime.current) / 100 : 0;


    // Play/pause logic
  useEffect(() => {
    //@ts-ignore
    let interval;

    // Set initial time
    if(playing && !initialTime.current) {
        initialTime.current = new Date();
    }
    const isSongEnd = lastNote && songDuration / 100 >= lastNote.time

    const animateTime = () => {
      setCurrentTime(new Date())
      interval = requestAnimationFrame(animateTime);
    }
    
    // Playing? Advance time!
    if(playing && !isSongEnd) {
        interval = requestAnimationFrame(animateTime);
    }

    // Stopped playing? Stop timer!
    if(!playing && isSongEnd && interval) {
      cancelAnimationFrame(interval);
    }


    // Clear timer if we dismount
    return () => {
        //@ts-ignore
      cancelAnimationFrame(interval);
    }
  }, [playing, songDuration, lastNote])

  const startTime = initialTime.current ? initialTime.current.toTimeString() : 0;
    console.log('time', songDuration, songDuration / 100)

    const visibleNotes = track.notes.filter((note) => note.time + note.duration >= songDuration && note.time + note.duration <= songDuration + FRAME_HEIGHT_TIME);
  console.log('visible notes', visibleNotes)

  return (
    <div>
        <h1>Current Time: {currentTime.toTimeString()}</h1>
        <h1>Initial Time: {startTime}</h1>
        <h1>Song Duration: {songDuration}</h1>

        <div>
            {/* {visibleNotes.map(note => <h2 key={`${note.name}-${note.time}`}>{note.name} - {note.time} - {note.duration}</h2>)} */}
            <NoteWaterfall notes={visibleNotes} time={songDuration} />    
        </div>
    </div>
  )
}

export default SongPlayer