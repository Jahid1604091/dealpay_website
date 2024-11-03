import React from 'react'

export default function Icon({path, name, height, width, className}) {
  return (
    <img className={className} src={`/icons/${path}.png`} height={height || 30} width={width || 30} alt={`${name} icon`} />
  )
}
