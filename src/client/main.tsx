import { hot } from "react-hot-loader"
import * as React from "react"
import * as ReactDOM from "react-dom"

import {App} from "./components/App"

import { Provider } from "mobx-react"
import { actionStore } from "./components/store"

let HotApp = hot(module)(App)
//import "./glob.css"


ReactDOM.render(
  <Provider actionStore={actionStore}>
    <HotApp />
  </Provider>,
  document.getElementById("root")
)

//@ts-ignore
if (module.hot) {
  //@ts-ignore
  module.hot.accept()
}
