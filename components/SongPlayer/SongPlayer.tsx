import { Track } from '@tonejs/midi';
import { Note } from '@tonejs/midi/dist/Note';
import React, { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'
import { FRAME_HEIGHT_TIME } from '../../utils/constants';
import NoteWaterfall from './NoteWaterfall';

type Props = {
    playing: boolean;
    track: Track;
    setPlaying: any;
}

const SongPlayer = ({playing, track, setPlaying}: Props) => {
    const [currentTime, setCurrentTime] = useState(0)
    console.log('track', track)
    // Did we hit last note? Stop! 
    const lastNote = track.notes[track.notes.length - 1];
    // Current seconds of song
    const songDuration = currentTime;

    console.log('web audio time', Tone.now())

    const restartSong = () => {
      setCurrentTime(0);
      setPlaying(false);
    }

    // Play/pause logic
  useEffect(() => {
    //@ts-ignore
    let interval;
    const isSongEnd = lastNote && songDuration >= lastNote.time
    console.log('is song over?', isSongEnd)

    const animateTime = () => {
      const newTime = Tone.now();
      setCurrentTime(newTime)
      console.log('looping time', newTime)
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


    const visibleNotes = track.notes.filter((note) => note.time + note.duration >= songDuration && note.time + note.duration <= songDuration + FRAME_HEIGHT_TIME);
  console.log('visible notes', visibleNotes)

  const minutes = Math.round(songDuration / 60)
  const seconds = Math.round(songDuration - minutes * 60)

  return (
    <div>
        <h1>Song Duration: {minutes} : {seconds}</h1>
        <button onClick={restartSong}>Restart Song</button>

        <div>
            {/* {visibleNotes.map(note => <h2 key={`${note.name}-${note.time}`}>{note.name} - {note.time} - {note.duration}</h2>)} */}
            <NoteWaterfall notes={visibleNotes} time={songDuration} />    
        </div>
    </div>
  )
}

export default SongPlayer