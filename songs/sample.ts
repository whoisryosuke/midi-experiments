import { Midi } from "@tonejs/midi"

// create a new midi file
const sample = new Midi()
sample.name = 'Sample Song';
// add a track
const track = sample.addTrack()
.addNote({
  name : 'C5',
  time : 0,
  duration: 0.1
})
.addNote({
  name : 'C5',
  time : 0.3,
  duration: 0.1
})
.addNote({
  name : 'C5',
  time : 0.6,
  duration: 0.1
})
track.name = 'C5 all day'

export default sample;