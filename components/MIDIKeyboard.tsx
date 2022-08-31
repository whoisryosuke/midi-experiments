import { WebMidi } from "webmidi";
import { useEffect, useState } from "react";

const MAX_NOTES = 10;

export default function MIDIKeyboard() {
  const [instruments, setInstrument] = useState<string[]>([]);
  const [playedNotes, setPlayedNotes] = useState<string[]>([]);
  const [currentNotes, setCurrentNotes] = useState<string[]>([]);
  function onEnabled() {
    // Inputs
    WebMidi.inputs.forEach((input) => {
      console.log("manu", input.manufacturer, "name", input.name);

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

  const keyLog = (e) => {
    // C2 - C7 (and more if user changes oct +/-)
    console.log(e.note.identifier);
    setPlayedNotes((prevNotes) => {
      const newNotes = [e.note.identifier,...prevNotes]
      // Truncate array - we only want latest 10 notes or so
      if(newNotes.length > MAX_NOTES) newNotes.length = MAX_NOTES;
      return newNotes
    });
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
        myInput.removeListener("noteon", keyLog);
        myInput.removeListener("noteoff", clearKey);
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
