import React from 'react';
import axios from 'axios';


import Voting from '../components/Voting';
const listData = ['Votation - 1'];


class VotingView extends React.Component{

    state = {
        id: 1,
        description: 'no description',
    }
    
    componentDidMount(){
        axios.get('http://127.0.0.1:8000/voting')
        .then(res => {
            this.setState({
                id: res.id,
                description: res.description,
            });
            console.log(res.data)
        })
    }

    logout(){
        
    }


    render(){
        return(
            <Voting data={listData} />
        )
    }
}

export default VotingView;