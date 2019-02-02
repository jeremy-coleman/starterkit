import * as React from 'react'
import {hot} from 'react-hot-loader'
import { style } from 'typestyle'
import { px } from 'csx'

import { color } from 'csx'

const PALETTE = {
 BLACK: color('#1C1B1B'),
 WHITE: color('#EAF1FC'),
 YELLOW:color('#FAAB1E'),
 PINK:  color('#E82572'),
 GREEN: color('#29D19A'),
 BLUE:  color('#2998F6')
}

const AppStyle = style({
  textAlign: 'center',
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


class Counter extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
      super(props)
      this.state = {
        counter: 0
      }
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
          {[
            PALETTE.WHITE,
            PALETTE.YELLOW,
            PALETTE.PINK,
            PALETTE.GREEN,
            PALETTE.BLUE
          ].map(color => (
            <h1 style={{ color: color.toHexString() }}>Hello Slate.</h1>
          ))}
          <p>Counting to {this.state.counter}.</p>
        </div>
      )
    }
  }


//export default hot(module)(Counter)
export default Counter

//export var App = AppRoot

//export {Counter}
//export default Counter