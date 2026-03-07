import FloorMap from "../../components/FloorMap"
import HeaderBar from "../../components/HeaderBar"
import RoomList from "../../components/RoomList"
import { rooms } from "../../data/room"

const FloorDashboard = () => {

  return (

    <div className="dashboard">

      <HeaderBar />

      <div className="content">

        <FloorMap rooms={rooms} />

        <RoomList rooms={rooms} />

      </div>

    </div>

  )

}

export default FloorDashboard