import * as React from "react"
import { observer, inject } from "mobx-react"

import Counter from "./counter"

let appHeaderStyles = {
  backgroundColor: "rgb(26, 196, 40)",
  height: "150px",
  padding: "20px",
  color: "blue"
}

type Props = {
  actionStore: any
}

@inject("actionStore")
@observer
class App extends React.Component<any, any> {
  render() {
    return (
      <div>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
          <span>
            inlined image:
            <div className="inline" />
          </span>
          <span>
            copied image:
            <div className="copy" />
          </span>
        </div>
        <div className="App">
          <div style={appHeaderStyles}>
            <svg className="App-logo" />
            <h1>React Browserify Demoz {this.props.actionStore.instructionMsg}</h1>
          </div>
          <p className="App-intro">
            <button
              style={{ background: "green", color: "blue", width: "100px", height: "50px" }}
              onClick={this.props.actionStore.sayAloha}
            >
              {this.props.actionStore.buttonMsg}
            </button>
          </p>
        </div>
        <Counter />
      </div>
    )
  }
}

export { App }
