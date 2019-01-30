import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import RaisedButton from '@material-ui/core/Button';
import axios from 'axios';
import { createMuiTheme, withStyles  } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
// import { BottomNavigationAction } from '@material-ui/core';
import BigInt from '../js/bigint';
import ElGamal from '../js/elgamal';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';


const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

const styles = theme => ({
  root:{
    width: '100%',
    maxWidth: 360,
  },
  inline: {
    display: 'inline',
  },

  form:{
    alignItems: 'center',
    display: 'flex'
  },
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
    margin: 15,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
    margin: 15,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
},
});


class Voting extends Component {
  constructor(props){
    super(props);
    this.state={
        voting: '',
        title: '',
        questions: [],
        desc: '',
        voter: '',
        token: '',
        bigpk : null,
        
        selectedItems: {}
    };
    this.getVoting = this.getVoting.bind(this);
  }
 
  render() {
    const { classes } = this.props;
   
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <List className={classes.root}>
            {this.state.questions.map((question,i) => {
              return(
                <ListItem alignitems="flex-start">
              <ListItemText primary={question.name}
                  secondary={
                        <React.Fragment>
                       <FormControl className={classes.textField} noValidate autoComplete="off" styles={{display:'flex'}}>
                            <FormLabel component = "legend">{question.desc}</FormLabel>
                            <RadioGroup aria-label="Question" className={classes.group}
                            value={this.state.value}  onChange={this.handleChange} >
                            <FormControlLabel value={question.options[i]} 
                                              control={<Radio />} label="Option1" />
                            <FormControlLabel value={question.options[i]}
                                              control={<Radio />} label="Option2" />
                            <FormControlLabel value={question.options[i]} 
                                              control={<Radio />} label="Option3" />
                          </RadioGroup>
                  <RaisedButton label="Submit" variant="contained" className={classes.button} 
                  onClick={this.getVoting}> Vote </RaisedButton>
            </FormControl>
                    </React.Fragment>
                      } />
            </ListItem>
              )
            })}
            
          </List>
          <RaisedButton label="Logout" variant="contained" className={classes.button}
                onClick={this.Logout}> Logout </RaisedButton>
        </MuiThemeProvider>
      </div>
    );

  }

  Logout(){
    // var headers = {
    //   'Content-Type': 'application/json'
    // }
    var token = sessionStorage.getItem("token");
    axios.post('http://localhost:8000/authentication/logout/', token)
      .then((response) =>{
        console.log(response.data);
        // sessionStorage.setItem("userData", response.data);
        // console.log(sessionStorage.getItem("userData"));
      })
      .catch(error => {
        alert(error);
      })
      sessionStorage.clear();
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
};

  getVoting(){

    var votingId = 1;
    if(sessionStorage.userData){
       var userData = sessionStorage.userData;
       var parsedData = JSON.parse(userData);
       console.log('userData: ' + userData);
       console.log('parsed data: ' + parsedData);
    
    var token = sessionStorage.getItem('token');
    console.log(parsedData.id);
    if(parsedData.id !== null && token !== null){
      axios.get('http://localhost:8000/census/'+ votingId + '/?voter_id=' + parsedData.id)
      .then((response) =>{
        if(response.status === 200){
          axios.get('http://localhost:8000/voting/?id=' + votingId)
          .then(response => {
            console.log(response.data);
            // let bigpk = {
            //     p: BigInt.fromJSONObject(response.data[0].pub_key.p.toString()),
            //     g: BigInt.fromJSONObject(response.data[0].pub_key.g.toString()),
            //     y: BigInt.fromJSONObject(response.data[0].pub_key.y.toString()),
            // };
            this.setState(
                {
                  voting : response.data[0],
                  title : response.data[0].name,
                  desc : response.data[0].desc,
                  questions: response.data[0].questions,
                  // bigpk : bigpk
                  bigpk : null
                }

            );
          })
          .catch(error => {
            alert(error);
          })
        }
        }).catch(error => {
          alert(error);
        })
      }
    }
    };



    _decideEncrypt() {
      let msg = this.state.itemsSelected;
      let bigmsg = BigInt.fromJSONObject(JSON.stringify(msg));
      let cipher = ElGamal.encrypt(this.state.bigpk, bigmsg);
      return cipher;
  };
  
    _decideSend  = async() => {
        const token = await sessionStorage.getItem('userToken');
        const id = await sessionStorage.getItem('userId');
        const voting_id = this.props.navigation.getParam('voting_id', '0');
        var v = this._decideEncrypt();
        var data = {
            vote: {a: v.alpha.toString(), b: v.beta.toString()},
            voting: parseInt(voting_id),
            voter: parseInt(id),
            token: token
        };

        axios.post('http://localhost:8000/store/', JSON.stringify(data))
        .then((response) => {
          if(response.status === 200){
            alert("Your vote has been send succesfully")
          }else{
            alert("Something went wrong")
          }
        })
        .catch(error => {
          alert("Error: " + error);
          console.error(error);
        });
      };


  componentWillMount(){
    this.getVoting();
  }



};

  
  Voting.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Voting);