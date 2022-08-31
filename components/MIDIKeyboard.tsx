import { WebMidi } from "webmidi";
import { useEffect, useState } from "react";
import { Track } from "@tonejs/midi";
import * as Tone from 'tone'

const MAX_NOTES = 10;
// Time in seconds that a user is allowed to be "off" from a note before it doesn't count
const USER_ERROR_ALLOWANCE = 1;

type Props = {
  playing: boolean;
  track: Track;
  setSucessfulNotes: any;
}

export default function MIDIKeyboard({ playing, track, setSucessfulNotes }: Props) {
  const [instruments, setInstrument] = useState<string[]>([]);
  const [playedNotes, setPlayedNotes] = useState<string[]>([]);
  const [currentNotes, setCurrentNotes] = useState<string[]>([]);
  function onEnabled() {
    // Inputs
    WebMidi.inputs.forEach((input) => {
      console.log("manufacturer", input.manufacturer, "name", input.name);

      const checkInstrument = instruments.findIndex(
        (instrument) => instrument === input.name
      );
      if (checkInstrument >= 0) return;
      setInstrument((prevInstruments) => [...prevInstruments, input.name]);
    });

    // Outputs
    WebMidi.outputs.forEach((output) => {
      console.log(output.manufacturer, output.name);
    });
  }

  console.log("instruments", instruments);
  console.log("currentNotes", currentNotes);
  useEffect(() => {
    WebMidi.enable()
      .then(onEnabled)
      .catch((err) => alert(err));

    return () => {
      WebMidi.disable();
    };
  }, []);

  const checkNote = (noteName:string) => {
    // Only check when "game" is running
    if(!playing) return;
    console.log('[KEYBOARD] Checking for successful notes', noteName)

    // Song duration in seconds
    const songDuration = Tone.now();
    // Check if we hit that specific note
    const notesHit = track.notes.filter((note) => note.name === noteName && note.time + note.duration >= songDuration && note.time + note.duration <= songDuration + USER_ERROR_ALLOWANCE);
    // No notes hit? Let's bail.
    if(notesHit.length <= 0) return;

    console.log('[KEYBOARD] Successful note!', notesHit)
    // Save hit notes to state
    setSucessfulNotes((prevNotes) => ([
      ...prevNotes,
      ...notesHit
    ]))
  }

  const keyLog = (e) => {
    // C2 - C7 (and more if user changes oct +/-)
    console.log(e.note.identifier);

    // Check if user succeeded to hit a note and grade them
    checkNote(e.note.identifier)

    // Note history
    // For debug purposes
    setPlayedNotes((prevNotes) => {
      const newNotes = [e.note.identifier,...prevNotes]
      // Truncate array - we only want latest 10 notes or so
      if(newNotes.length > MAX_NOTES) newNotes.length = MAX_NOTES;
      return newNotes
    });

    // Keep track of notes currently pressed
    setCurrentNotes((prevNotes) =>
      Array.from(new Set([e.note.identifier, ...prevNotes]))
    );
  };

  const clearKey = (e) => {
    const clearNote = `${e.note.identifier}`;
    console.log("key off", e.note.identifier, clearNote, currentNotes);
    setCurrentNotes((prevNotes) =>
      prevNotes.filter((note) => note !== clearNote)
    );
    console.log("clearign key");
  };

  useEffect(() => {
    if (instruments[0]) {
      const myInput = WebMidi.getInputByName(instruments[0]);
      myInput.addListener("noteon", keyLog);
      myInput.addListener("noteoff", clearKey);
    }
    return () => {
      if (instruments[0]) {
        const myInput = WebMidi.getInputByName(instruments[0]);
        myInput?.removeListener("noteon", keyLog);
        myInput?.removeListener("noteoff", clearKey);
      }
    };
  }, [instruments]);

  return (
    <div>
      <h1>MIDI Keyboard</h1>
      <h2>Current Note: {currentNotes.join(", ")}</h2>
      <h2>Played notes</h2>
      <div style={{ display: 'flex',}}>
        {playedNotes.map((note, index) => (
          <h4 key={`${index}-${note}`} style={{marginRight: '8px'}}>{note}</h4>
        ))}
      </div>
    </div>
  );
}
