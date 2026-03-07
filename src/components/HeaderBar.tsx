import { useEffect, useState } from "react"

const HeaderBar = () => {

  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="header">

      <div className="header-left">
        <div className="date">
          {time.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric"
          })}
        </div>

        <div className="clock">
          {time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </div>
      </div>

      <div className="header-right">
        <div className="city">WIUT, Tashkent</div>
        <div className="floor">Floor 5</div>
      </div>

    </div>
  )
}

export default HeaderBar