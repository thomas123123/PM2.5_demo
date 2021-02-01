import React, { PureComponent } from 'react';

import fetch from 'isomorphic-fetch';

import { PM25_API } from './config';

import PM25Table from './components/PM25Table';

export class App extends PureComponent{

    constructor(props){
        super(props);
        this.state = {
          citys: []
        };
    }

    componentDidMount(){
      this._GetPM25Data();
    }

    // 取的PM2.5資料
    _GetPM25Data = () => {
      fetch(PM25_API)
      .then(res => res.json())
      .then(resbody => this.setState({ citys: resbody }))
      .catch(err => console.log(err))
    }

    render(){
      const { citys } = this.state;
        return(
          <div>
            <PM25Table citys={citys}/>
          </div>
        );
    }
}

export default App