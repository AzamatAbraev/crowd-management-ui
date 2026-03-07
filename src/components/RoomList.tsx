import { useState } from "react"
import type { Room } from "../data/room"

interface Props {
  rooms: Room[]
}

const RoomList = ({ rooms }: Props) => {

  const [search, setSearch] = useState("")

  const filtered = rooms.filter(r =>
    r.id.toLowerCase().includes(search.toLowerCase())
  )

  return (

    <div className="sidebar">

      <h3>Looking for a space?</h3>

      <div className="room-list">

        {filtered.map(room => (
          <div key={room.id} className="room-item">

            <span className={
              room.occupied ? "dot red" : "dot green"
            } />

            {room.id}

          </div>
        ))}

      </div>

      <input
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search"
      />

      <button
        className="reset"
        onClick={() => setSearch("")}
      >
        Reset
      </button>

    </div>

  )

}

export default RoomList;