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

export class Counter extends React.Component<AppProps, AppState> {
  state = {
    intervalId: 0,
    counter: 0
  }

  tick() {
    this.setState({ counter: this.state.counter + 1 })
  }

  componentDidMount() {
    this.setState({
      intervalId: window.setInterval(() => this.tick(), 130)
    })
  }

  componentWillUnmount() {
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId)
    }
  }

  render() {
    return (
      <div className={AppStyle}>
        <p>Counting to {this.state.counter}.</p>
      </div>
    )
  }
}

export default Counter
