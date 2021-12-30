import { observer } from "mobx-react-lite"
import * as React from "react"
import Counter from "./counter"
import { actionStore } from "./store"

let appHeaderStyles = {
  backgroundColor: "rgb(26, 196, 40)",
  height: "150px",
  padding: "20px",
  color: "blue"
}

export default observer(function App(props) {
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
          <h1>React Browserify Demo {actionStore.instructionMsg}</h1>
        </div>
        <p className="App-intro">
          <button
            style={{ background: "green", color: "blue", width: "100px", height: "50px" }}
            onClick={actionStore.sayAloha}
          >
            {actionStore.buttonMsg}
          </button>
        </p>
      </div>
      <Counter />
    </div>
  )
})
