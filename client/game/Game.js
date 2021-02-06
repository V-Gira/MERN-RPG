import React, {useState, useEffect}  from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Edit from '@material-ui/icons/Edit'
import PeopleIcon from '@material-ui/icons/Group'
import CompletedIcon from '@material-ui/icons/VerifiedUser'
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import {read, update} from './api-game.js'
import {enrollmentStats} from './../enrollment/api-enrollment'
import {Link, Redirect} from 'react-router-dom'
import auth from './../auth/auth-helper'
import DeleteGame from './DeleteGame'
import Divider from '@material-ui/core/Divider'
import NewMission from './NewMission'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Enroll from './../enrollment/Enroll'

const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
        maxWidth: 800,
        margin: 'auto',
        padding: theme.spacing(3),
        marginTop: theme.spacing(12)
      }),
  flex:{
    display:'flex',
    marginBottom: 20
  },
  card: {
    padding:'24px 40px 40px'
  },
  subheading: {
    margin: '10px',
    color: theme.palette.openTitle
  },
  details: {
    margin: '16px',
  },
  sub: {
    display: 'block',
    margin: '3px 0px 5px 0px',
    fontSize: '0.9em'
  },
  media: {
    height: 190,
    display: 'inline-block',
    width: '100%',
    marginLeft: '16px'
  },
  icon: {
    verticalAlign: 'sub'
  },
  category:{
    color: '#5c5c5c',
    fontSize: '0.9em',
    padding: '3px 5px',
    backgroundColor: '#dbdbdb',
    borderRadius: '0.2em',
    marginTop: 5
  },
  action: {
    margin: '10px 0px',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  statSpan: {
    margin: '7px 10px 0 10px',
    alignItems: 'center',
    color: '#616161',
    display: 'inline-flex',
    '& svg': {
      marginRight: 10,
      color: '#b6ab9a'
    }
  },
  enroll:{
    float: 'right'
  }
}))

export default function Game ({match}) {
  const classes = useStyles()
  const [stats, setStats] = useState({})
  const [game, setGame] = useState({gameMaster:{}})
  const [values, setValues] = useState({
      redirect: false,
      error: ''
    })
  const [open, setOpen] = useState(false)
  const jwt = auth.isAuthenticated()
    useEffect(() => {
      const abortController = new AbortController()
      const signal = abortController.signal
  
      read({gameId: match.params.gameId}, signal).then((data) => {
        if (data.error) {
          setValues({...values, error: data.error})
        } else {
          setGame(data)
        }
      })
    return function cleanup(){
      abortController.abort()
    }
  }, [match.params.gameId])
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    enrollmentStats({gameId: match.params.gameId}, {t:jwt.token}, signal).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error})
      } else {
        setStats(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [match.params.gameId])
  const removeGame = (game) => {
    setValues({...values, redirect:true})
  }
  const addMission = (game) => {
    setGame(game)
  }
  const clickPublish = () => {
    if(game.missions.length > 0){    
      setOpen(true)
    }
  }
  const publish = () => {
    let gameData = new FormData()
      gameData.append('published', true)
      update({
          gameId: match.params.gameId
        }, {
          t: jwt.token
        }, gameData).then((data) => {
          if (data && data.error) {
            setValues({...values, error: data.error})
          } else {
            setGame({...game, published: true})
            setOpen(false)
          }
      })
  }
  const handleClose = () => {
    setOpen(false)
  }
  if (values.redirect) {
    return (<Redirect to={'/teach/games'}/>)
  }
    const imageUrl = game._id
          ? `/api/games/photo/${game._id}?${new Date().getTime()}`
          : '/api/games/defaultphoto'
    return (
        <div className={classes.root}>
              <Card className={classes.card}>
                <CardHeader
                  title={game.name}
                  subheader={<div>
                        <Link to={"/user/"+game.gameMaster._id} className={classes.sub}>By {game.gameMaster.name}</Link>
                        <span className={classes.category}>{game.category}</span>
                      </div>
                    }
                  action={<>
             {auth.isAuthenticated().user && auth.isAuthenticated().user._id == game.gameMaster._id &&
                (<span className={classes.action}>
                  <Link to={"/teach/game/edit/" + game._id}>
                    <IconButton aria-label="Edit" color="secondary">
                      <Edit/>
                    </IconButton>
                  </Link>
                {!game.published ? (<>
                  <Button color="secondary" variant="outlined" onClick={clickPublish}>{game.missions.length == 0 ? "Add atleast 1 mission to publish" : "Publish"}</Button>
                  <DeleteGame game={game} onRemove={removeGame}/>
                </>) : (
                  <Button color="primary" variant="outlined">Published</Button>
                )}
                </span>)
             }
                {game.published && (<div>
                  <span className={classes.statSpan}><PeopleIcon /> {stats.totalEnrolled} enrolled </span>
                  <span className={classes.statSpan}><CompletedIcon/> {stats.totalCompleted} completed </span>
                  </div>
                  )}
                
                </>
            }
                />
                <div className={classes.flex}>
                  <CardMedia
                    className={classes.media}
                    image={imageUrl}
                    title={game.name}
                  />
                  <div className={classes.details}>
                    <Typography variant="body1" className={classes.subheading}>
                        {game.description}<br/>
                    </Typography>
                    
              {game.published && <div className={classes.enroll}><Enroll gameId={game._id}/></div>} 
                    
                    
                  </div>
                </div>
                <Divider/>
                <div>
                <CardHeader
                  title={<Typography variant="h6" className={classes.subheading}>Missions</Typography>
                }
                  subheader={<Typography variant="body1" className={classes.subheading}>{game.missions && game.missions.length} missions</Typography>}
                  action={
             auth.isAuthenticated().user && auth.isAuthenticated().user._id == game.gameMaster._id && !game.published &&
                (<span className={classes.action}>
                  <NewMission gameId={game._id} addMission={addMission}/>
                </span>)
            }
                />
                <List>
                {game.missions && game.missions.map((mission, index) => {
                    return(<span key={index}>
                    <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                        {index+1}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={mission.title}
                    />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    </span>)
                }
                )}
                </List>
                </div>
              </Card>
              <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Publish Game</DialogTitle>
                <DialogContent>
                  <Typography variant="body1">Publishing your game will make it live to players for enrollment. </Typography><Typography variant="body1">Make sure all missions are added and ready for publishing.</Typography></DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color="primary" variant="contained">
                  Cancel
                </Button>
                <Button onClick={publish} color="secondary" variant="contained">
                  Publish
                </Button>
              </DialogActions>
             </Dialog>   
        </div>)
}
