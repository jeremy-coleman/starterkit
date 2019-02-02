//0 kb dev overhead
//123kb vs 190.9kb for prod


import {action, observable, computed} from 'mobx'

class ActionTest {
  @observable buttonMsg = 'hi'

  @computed get instructionMsg () {
    return this.buttonMsg === 'hi' ? 'click to say bye' : 'click to say hi';
  }

  @action sayAloha = () => {
    return this.buttonMsg == 'hi' ? this.buttonMsg = 'bye' : this.buttonMsg = 'hi';
  }

}

export let actionStore = new ActionTest()
