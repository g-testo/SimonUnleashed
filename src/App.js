import React from 'react';
import './App.css';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MusicNoteIcon from '@material-ui/icons/MusicNote';

// add slider to blink response speed
// add settings model with audio, difficulty level and reset highscore
// 

class App extends React.Component{
  constructor(){
    super();
    this.state={
      score:0,
      highScore:0,
      box1:false,
      box2:false,
      box3:false,
      box4:false,
      box5:false,
      box6:false,
      difficultyLevel:1,
      sixBoxMode:false,
      disabled:true,
      displayGame:true,
      gameStarted:false,
      compPattern:[],
      userPattern:[],
      audioAuto:false,
      audioControl:false
    }
  }

  componentDidMount(){
    let highScore = localStorage.getItem('highScore');
    let autoAudio = localStorage.getItem('audioAuto');
    let randNum = this.getRandomInt();

    this.rotatingLights(3);
    this.setState({ highScore, compPattern: [...this.state.compPattern, randNum], autoAudio: autoAudio });
  }

  componentDidUpdate(){
    let inputArr = this.state.userPattern;
    let compArr = this.state.compPattern;

    let boolArr = inputArr.map((item, index)=>{
      return item === compArr[index];
    })
    let isCorrect = !boolArr.includes(false);

    if(isCorrect !== true && this.state.displayGame === true) {
      this.setState({displayGame:false})
    }
    if(compArr.length <= inputArr.length && isCorrect){
      this.setState({score:this.state.score + 1})

      let newRandNum = this.getRandomInt();
      this.setState({userPattern:[], compPattern: [...this.state.compPattern, newRandNum]});

      this.showPattern([...compArr, newRandNum]);
    }
    let score = this.state.score;

    if(score > 2 && this.state.difficultyLevel < 2){
      this.setState({difficultyLevel:2});
    } else if(score > 4 && this.state.difficultyLevel < 3){
      this.setState({difficultyLevel:3});
    }

    if(score > this.state.highScore){
      this.setState({highScore:score});
      localStorage.setItem('highScore',score);
    }
  }

  resetHighScore=()=>{
    this.setState({highScore:0});
    localStorage.setItem('highScore',0);
  }

  getRandomInt=()=>{
    let min = 1;
    let max = 5;
    if(this.state.sixBoxMode){
      max = 7;
    }
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  showPattern=(currPat)=>{
    for(let i=0;i<currPat.length;i++){
      setTimeout(()=>{
        this.blink(currPat[i], 300);
      }, 800*(i+1))
    }
  }

  blink=(boxId, speed)=>{
      this.setState({["box"+boxId]: true});
      setTimeout(()=>{
        this.setState({["box"+boxId]: false});
      }, speed)
  }

  handleClick=(id)=>{
    this.blink(id, 300);
    this.setState({
      userPattern: [...this.state.userPattern, id]
    });
  }

  rotatingLights=(rotations)=>{
    let boxArr = [1,2,3,4];
    for(let i=1;i<5*rotations;i++){
      setTimeout(()=>{
        this.blink(boxArr[i%4],150);
      }, 100*(i+1))
    }
  }

  startFunc=()=>{
    this.setState({disabled:false, gameStarted:true, audioAuto:true})
    let compPat = this.state.compPattern;
    this.showPattern(compPat);
  }
  restartFunc=()=>{
    let randNum = this.getRandomInt();
    this.setState({displayGame:true, score:0, compPattern:[randNum], userPattern:[], difficultyLevel:1})
    this.showPattern([randNum]);
  }
  sixBoxToggle=()=>{
    this.setState({sixBoxMode: !this.state.sixBoxMode});
  }

  render(){

    let difNum = this.state.difficultyLevel;
    let difClass = "";
    if(difNum === 2){
      difClass="medium"
    } else if(difNum === 3) {
      difClass="hard"
    }
    let disableClick = this.state.disabled ? "none" : "auto";

    let red = "255,0,0";
    let green = "0,255,0";
    let yellow = "255,255,0";
    let blue = "0,0,255";
    let orange = "255,128,0";
    let lightBlue = "0,255,255";

    let topLeft="100px 0 0 0";
    let topRight="0 100px 0 0";
    let bottomLeft="0 0 0 100px";
    let bottomRight="0 0 100px 0";
    let middle="0";


    let boxDataArr = [{
      id:1,
      color:red,
      radius:topLeft
    },{
      id:2,
      color:green,
      radius:topRight
    },{
      id:4,
      color:yellow,
      radius:bottomLeft
    },{
      id:3,
      color:blue,
      radius:bottomRight
    }];

    let addBoxArr = [{
      id:5,
      color:orange,
      radius:middle
    },{
      id:6,
      color:lightBlue,
      radius:middle
    }]

    if(this.state.sixBoxMode){
      boxDataArr.splice(1,0,addBoxArr[0])
      boxDataArr.splice(4,0,addBoxArr[1])
    }

    let boxElArr = boxDataArr.map((box)=>{
      return <Box key={box.id} id={box.id} disabled={disableClick} active={this.state["box" + box.id]} handleClick={this.handleClick} radius={box.radius} color={box.color}/>
    });

    return(
      <div id="wrapper">
        <h1>Simon Unleashed</h1>
          <FormControlLabel
            className="hardcoreToggle"
            control={
              <Switch
                checked={this.state.sixBoxMode}
                size="small"
                onChange={this.sixBoxToggle}
                value="checkedB"
                color="primary"
              />
            }
            label="Hardcore"
            labelPlacement="top"
          />

        <div id="score">{"Current Score: " + this.state.score}</div>
        <div>{"High Score: " + this.state.highScore}<span id="resetHighScore" onClick={this.resetHighScore}> Reset</span></div>

        <IconButton onClick={()=>this.setState({audioControl:!this.state.audioControl})} color="secondary" aria-label="toggle music menu">
          <MusicNoteIcon color="primary"/>
        </IconButton>
        <audio controls={this.state.audioControl && "controls"} autoPlay={this.state.audioAuto ? "autoplay" : false}>
          <source src="onandon.ogg" type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>

        <div id="boxWrapper" className={difClass + " " + (!this.state.sixBoxMode && "defaultWidth")} style={{display:!this.state.displayGame && "none"}}>
          {boxElArr}
        </div>
        {!this.state.gameStarted ? <Button onClick={this.startFunc}>Start Game</Button> : <Button onClick={this.restartFunc}>Restart Game</Button>}
        <Button id="showPatButton" onClick={()=>this.showPattern(this.state.compPattern)}>Show Pattern</Button>
      </div>
    )
  }
}

const Box = (props) => {
  let opacity = props.active ? ".75" : ".25";
  let boxStyle = {
    pointerEvents: props.disabled,
    borderRadius: props.radius,
    backgroundColor: "rgba(" + props.color +","+ opacity + ")"
  }
  return(
    <div onClick={()=>{props.handleClick(props.id)}} className="boxStyling" style={boxStyle}></div>
  )
}


export default App;