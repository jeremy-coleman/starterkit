import { observable } from "mobx"

export let actionStore = observable({
  buttonMsg: "hi",
  get instructionMsg() {
    return actionStore.buttonMsg === "hi" ? "click to say bye" : "click to say hi"
  },
  sayAloha() {
    return actionStore.buttonMsg == "hi" ? (actionStore.buttonMsg = "bye") : (actionStore.buttonMsg = "hi")
  }
})
