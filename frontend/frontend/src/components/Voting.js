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
    backgroundColor: theme.palette.background.paper,
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

var votingId = 1;
var userData = sessionStorage.getItem("userData");
var token = sessionStorage.getItem("token");

class Voting extends Component {
  constructor(props){
    super(props);
    this.state={
        voting: '',
        title: '',
        questions: [],
        desc: '',
        voter: userData.id,
        token: token,
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
              <ListItemText primary={question.desc}
                  secondary={
                        <React.Fragment>
                      <Typography component="span" className={classes.inline} color="textPrimary">
                      {this.state.desc}
                      </Typography>
                    </React.Fragment>
                      } />
                 <FormControl className={classes.textField} noValidate autoComplete="off" styles={{display:'flex'}}>
                            <FormLabel component = "legend">Question</FormLabel>
                            <RadioGroup aria-label="Question" className={classes.group}
                            value={this.state.value}  onChange={this.handleChange} >
                            <FormControlLabel value={this.state.voting.questions[0].options[0]} 
                                              control={<Radio />} label="Option1" />
                            <FormControlLabel value="option2" control={<Radio />} label="Option2" />
                            <FormControlLabel value="option3" control={<Radio />} label="Option3" />
                          </RadioGroup>
                  {/* <RaisedButton label="Submit" variant="contained" className={classes.button} 
                  onClick={this.getVoting}> Vote </RaisedButton> */}
            </FormControl>
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

  

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
};

  getVoting(){
    if(userData.id !== null && token !== null){
      axios.get('http://localhost:8000/census/'+ votingId + '/?voter_id=' + userData.id)
      .then((response) =>{
        if(response.status === 200){
          axios.get('http://localhost:8000/voting/?id=' + votingId)
          .then(response => {
            console.log(response);
            let voting = JSON.parse(response._bodyText)[0];
            let bigpk = {
                p: BigInt.fromJSONObject(voting.pub_key.p.toString()),
                g: BigInt.fromJSONObject(voting.pub_key.g.toString()),
                y: BigInt.fromJSONObject(voting.pub_key.y.toString()),
            };
            this.setState(
                {
                  voting : JSON.parse(response)[0],
                  title : voting.name,
                  desc : voting.desc,
                  questions: voting.questions,
                  bigpk : bigpk
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



 

    
  // handleClick(){
  //     const params = new URLSearchParams();
  //     params.append('voting', this.state.voting);
  //     params.append('questions', this.state.questions);
  //     params.append('voter', this.state.voter);
  //     params.append('token', this.state.token);
  //     axios.post(apiBaseUrl+'login/', params)
      
    
  //   .then(function (response) {
  //     //console.log(response);
  //       document.cookie = 'decide='+response.token+';';
  //       const param = new URLSearchParams();
  //       param.append('token', response.data.token)
  //         axios.post(apiBaseUrl+'getuser/', param)
  //         .then(function(response2){
  //           console.log(response2.status)
  //           if(response2.status === 200){
  //             console.log("Login successfull");
              
  //           }
  //           else if(response2.status === 204){
  //               console.log("Username password do not match");
  //               alert(response2.data.success)
  //           }
  //           else{
  //               console.log("Username does not exists");
  //               alert("Username does not exist");
  //           }
  //         }).catch(error => {
  //           alert(error);
  //         });
        
  //   })
  //   }
  
  
  Voting.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Voting);