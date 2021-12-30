import { color, px } from "csx"
import * as React from "react"
import { style } from "typestyle"

const PALETTE = {
  BLACK: color("#1C1B1B"),
  WHITE: color("#EAF1FC"),
  YELLOW: color("#FAAB1E"),
  PINK: color("#E82572"),
  GREEN: color("#29D19A"),
  BLUE: color("#2998F6")
}

const AppStyle = style({
  textAlign: "center",
  $nest: {
    h1: {
      fontSize: px(76)
    }
  }
})

type AppProps = {}

type AppState = {
  intervalId?: number
  counter: number
}

var Counter = (props) => {
  const [intervalId, setIntervalId] = React.useState(0)
  const [counter, setCounter] = React.useState(0)

  function tick() {
    var next = counter + 1
    setCounter(next)
  }

  React.useEffect(() => {
    var _intervalId = window.setInterval(() => tick(), 130)
    setIntervalId(_intervalId)
    return () => {
      clearInterval(intervalId)
    }
  }, [counter])

  return (
    <div className={AppStyle}>
      <p>Counting to {counter}.</p>
    </div>
  )
}

export default Counter
