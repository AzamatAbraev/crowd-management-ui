import type { Room } from "../data/room"

interface Props {
  rooms: Room[]
}

const FloorMap = ({ rooms }: Props) => {

  return (

    <div className="map-container">

      <svg viewBox="0 0 1000 600" className="floor-svg">

        <rect x="0" y="0" width="1000" height="600" fill="#f4f4f4" />

        {rooms.map(room => (
          <rect
            key={room.id}
            x={room.x}
            y={room.y}
            width={room.width}
            height={room.height}
            className={room.occupied ? "room-occupied" : "room-free"}
          />
        ))}

      </svg>

    </div>

  )
}

export default FloorMap