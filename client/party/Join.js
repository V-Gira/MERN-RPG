import React, {useState} from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles'
import {create} from './api-party'
import auth from '../auth/auth-helper'
import {Redirect} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    form: {
        minWidth: 500
    }
}))

export default function Join(props) {
  const classes = useStyles()
  const [values, setValues] = useState({
    partyId: '',
    error: '',
    redirect: false
  })
  const jwt = auth.isAuthenticated()
  const clickJoin = () => {
    create({
      gameId: props.gameId
    }, {
      t: jwt.token
    }).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, partyId: data._id, redirect: true})
      }
    })
  }

    if(values.redirect){
        return (<Redirect to={'/learn/'+values.partyId}/>)
    }

  return (
      <Button variant="contained" color="secondary" onClick={clickJoin}> Join </Button>
  )
}

Join.propTypes = {
  gameId: PropTypes.string.isRequired
}
