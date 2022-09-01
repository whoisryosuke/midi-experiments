import React from "react";

export default function Stack({ children, gap = '8px', direction = 'horizontal' }) {
const styleDirection = direction === 'horizontal' ? 'marginRight' : 'marginBottom'
const containerDirection = direction === 'horizontal' ? 'row' : 'column'

  const childrenWithProps = React.Children.map(children, child => {
    const newStyle = {
        [styleDirection]: gap
    }

    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { style: {
        ...child.props.style,
        ...newStyle
      } });
    }
    return child;
  });

  return <div style={{
    display: 'flex',
    flexDirection: containerDirection,
  }}>{childrenWithProps}</div>
}