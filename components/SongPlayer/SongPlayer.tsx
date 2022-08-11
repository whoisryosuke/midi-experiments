import { Track } from '@tonejs/midi';
import { Note } from '@tonejs/midi/dist/Note';
import React, { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'

type Props = {
    playing: boolean;
    track: Track;
}

const SongPlayer = ({playing, track}: Props) => {
    const [notes, setNotes] = useState<Note[]>([])
    const [currentTime, setCurrentTime] = useState(new Date())
    const initialTime = useRef<Date | null>(null)
    console.log('track', track)
    // Did we hit last note? Stop! 
    const lastNote = track.notes[track.notes.length - 1];
    // Current seconds of song
    const songDuration = initialTime.current ? (currentTime - initialTime.current) / 100 : 0;
    // Our graph goes from 0 - FRAME_HEIGHT_TIME seconds
    const FRAME_HEIGHT_TIME = 10;


    // Play/pause logic
  useEffect(() => {
    //@ts-ignore
    let interval;

    // Set initial time
    if(playing && !initialTime.current) {
        initialTime.current = new Date();
    }
    const isSongEnd = lastNote && songDuration / 100 >= lastNote.time
    
    // Playing? Advance time!
    if(playing && !isSongEnd) {
        interval = setInterval(() => {
            setCurrentTime(new Date())
        }, 100);
    }

    // Stopped playing? Stop timer!
    if(!playing && isSongEnd) {
      clearInterval(interval);
    }


    // Clear timer if we dismount
    return () => {
        //@ts-ignore
      clearInterval(interval);
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
            {visibleNotes.map(note => <h2 key={`${note.name}-${note.time}`}>{note.name} - {note.time} - {note.duration}</h2>)}
        </div>
    </div>
  )
}

export default SongPlayer