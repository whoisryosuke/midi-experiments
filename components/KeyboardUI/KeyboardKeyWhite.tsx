import React from 'react'
import styled from "styled-components"
import useAppStore from '../../store/app'

type StyledKeyboardKeyWhiteProps = {
    pressed: boolean;
}

const StyledKeyboardKeyWhite = styled.div<StyledKeyboardKeyWhiteProps>({
    width: 20,
    height: 100,
    backgroundColor: 'white',
    textAlign: 'center',
}, 
(props) => props.pressed && {
    backgroundColor:'teal',
})

const KeyboardKeyWhiteLabel = styled.span({
    fontSize: '10px',
    color: 'black'
})

type Props = {
    label:string;
}

const KeyboardKeyWhite = ({label, ...props}: Props) => {
    const { currentNotes } = useAppStore();
    const isPressed = currentNotes.findIndex((note) => note === label) > 0
  return (
    <StyledKeyboardKeyWhite pressed={isPressed} {...props}>
        {label && <KeyboardKeyWhiteLabel>{label}</KeyboardKeyWhiteLabel>}
    </StyledKeyboardKeyWhite>
  )
}

export default KeyboardKeyWhite