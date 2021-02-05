import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Divider from '@material-ui/core/Divider'
import {listPublished} from './../game/api-game'
import {listEnrolled, listCompleted} from './../enrollment/api-enrollment'
import Typography from '@material-ui/core/Typography'
import auth from './../auth/auth-helper'
import Games from './../game/Games'
import Enrollments from '../enrollment/Enrollments'


const useStyles = makeStyles(theme => ({
  card: {
    width:'90%',
    margin: 'auto',
    marginTop: 20,
    marginBottom: theme.spacing(2),
    padding: 20,
    backgroundColor: '#ffffff' 
  },
  extraTop: {
    marginTop: theme.spacing(12)
  },
  title: {
    padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle
  },
  media: {
    minHeight: 400
  },
  gridList: {
    width: '100%',
    minHeight: 200,
    padding: '16px 0 10px'
  },
  tile: {
    textAlign: 'center'
  },
  image: {
    height: '100%'
  },
  tileBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    textAlign: 'left'
  },
  enrolledTitle: {
    color:'#efefef',
    marginBottom: 5
  },
  action:{
    margin: '0 10px'
  },
  enrolledCard: {
    backgroundColor: '#616161',
  },
  divider: {
    marginBottom: 16,
    backgroundColor: 'rgb(157, 157, 157)'
  },
  noTitle: {
    color: 'lightgrey',
    marginBottom: 12,
    marginLeft: 8
  }
}))

export default function Home(){
  const classes = useStyles()
  const jwt = auth.isAuthenticated()
  const [games, setGames] = useState([])
  const [enrolled, setEnrolled] = useState([])
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listEnrolled({t: jwt.token}, signal).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setEnrolled(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listPublished(signal).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setGames(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])
    return (<div className={classes.extraTop}>
      {auth.isAuthenticated().user && (
      <Card className={`${classes.card} ${classes.enrolledCard}`}>
        <Typography variant="h6" component="h2" className={classes.enrolledTitle}>
            Games you are enrolled in
        </Typography>
        {enrolled.length != 0 ? (<Enrollments enrollments={enrolled}/>)
                             : (<Typography variant="body1" className={classes.noTitle}>No games.</Typography>)
        }
      </Card>
      )}
      <Card className={classes.card}>
        <Typography variant="h5" component="h2">
            All Games
        </Typography>
        {(games.length != 0 && games.length != enrolled.length) ? (<Games games={games} common={enrolled}/>) 
                             : (<Typography variant="body1" className={classes.noTitle}>No new games.</Typography>)
        }
      </Card>
    </div>
    )
}

