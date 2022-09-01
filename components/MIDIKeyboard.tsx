import { WebMidi } from "webmidi";
import { useCallback, useEffect, useState } from "react";
import { Track } from "@tonejs/midi";
import * as Tone from 'tone'
import useAppStore from "../store/app";

const MAX_NOTES = 10;
// Time in seconds that a user is allowed to be "off" from a note before it doesn't count
const USER_ERROR_ALLOWANCE = 1;

type Props = {
  playing: boolean;
}

export default function MIDIKeyboard({ playing,  }: Props) {
  const [instruments, setInstrument] = useState<string[]>([]);
  const [playedNotes, setPlayedNotes] = useState<string[]>([]);
  // const [currentNotes, setCurrentNotes] = useState<string[]>([]);
  const { currentNotes, setCurrentNotes, notes, setNotes } = useAppStore();


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
  console.log("played notes", notes);
  console.log("currentNotes", currentNotes);
  useEffect(() => {
    WebMidi.enable()
      .then(onEnabled)
      .catch((err) => alert(err));

    return () => {
      WebMidi.disable();
    };
  }, []);

  const keyLog = useCallback((e) => {
    // C2 - C7 (and more if user changes oct +/-)
    console.log(e.note.identifier);

    // Note history
    // For debug purposes
    // const currentTime = Tone.now();
    // Use Date for now - but ideally would use WebAudio context (through Tone.now())
    const currentTime = new Date().getTime();
    const newNote = {
      name: e.note.identifier,
      time: currentTime,
    }
    const newNotes = [newNote,...notes]
    // Truncate array - we only want latest 10 notes or so
    if(newNotes.length > MAX_NOTES) newNotes.length = MAX_NOTES;
    setNotes(newNotes);

    // Keep track of notes currently pressed
    console.log('note pressed', Array.from(new Set([e.note.identifier, ...currentNotes])) )
    setCurrentNotes(
      Array.from(new Set([e.note.identifier, ...currentNotes])) 
    );
  }, [currentNotes, notes, setNotes, setCurrentNotes]);

  const clearKey = useCallback((e) => {
    const clearNote = `${e.note.identifier}`;
    console.log("key off", e.note.identifier, clearNote, currentNotes);
    setCurrentNotes(
      currentNotes.filter((note) => note !== clearNote)
    );
    console.log("clearign key");
  }, [setCurrentNotes, currentNotes]);

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
  }, [instruments, clearKey, keyLog]);

  return (
    <div style={{position: 'absolute', top: 0, right: 0, width: '400px', border: '1px solid', borderRadius: '16px', padding: '8px 16px' }}>
      <h1>MIDI Keyboard</h1>
      <h2>Current Note: {currentNotes.join(", ")}</h2>
      <h2>Played notes</h2>
      <div style={{ display: 'flex',}}>
        {notes.map((note, index) => (
          <h4 key={`${index}-${note}`} style={{marginRight: '8px'}}>{note.name}</h4>
        ))}
      </div>
    </div>
  );
}
