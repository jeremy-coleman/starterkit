import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

import {observable} from 'mobx'
import {observer} from 'mobx-react'

const modalState = observable.object({open: false});

let toggleModal = () => {
  modalState.open = !modalState.open
}

export let PasswordModal = observer(() => {
    return (
     <div style={{textAlign: 'center'}}>
        <Dialog open={modalState.open} onClose={() => {
          toggleModal()
          console.log(modalState.open)
          }}>
          <DialogTitle>Super Secret Password</DialogTitle>
          <DialogContent>
            <DialogContentText>1-2-3-4-5</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={() => {
              toggleModal()
              console.log(modalState.open)
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
        
        <Typography variant="h4" gutterBottom>
          Material-UI
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          example project
        </Typography>
        <Button variant="contained" color="secondary"
          onClick={() => {
          toggleModal()
          console.log(modalState.open)}
        }>
          Super Secret Password
        </Button>
      </div>
    );
  }
)