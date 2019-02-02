import { inject, observer } from 'mobx-react';
import * as React from 'react';


//import { PasswordModal } from './components/PasswordModal';
//import { Store } from './stores';

//mobx devtools 40kb
//react router 30k


//@inject('nav')
@observer
class CogliteApp extends React.Component {
renderDevTool() {}
  //   if (process.env.NODE_ENV === 'production') {
  //     const DevTools = require('mobx-react-devtools').default;
  //     return <DevTools position={{buttom: 0}}/>;
  //   }
  // }

// render(){
// //const {nav} = this.props as Store
//  return(
//   <React.Fragment>
//     <PasswordModal/>
//   </React.Fragment>
//  )}
// }


render(){
//const {nav} = this.props as Store
 return(
  <React.Fragment>
    <div/>
  </React.Fragment>
 )}
}

export {CogliteApp}