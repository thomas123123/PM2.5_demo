import React, { PureComponent } from 'react';

import fetch from 'isomorphic-fetch';

import { PM25_API } from './config';

import PM25Table from './components/PM25Table';

import './App.css';

export class App extends PureComponent{

    constructor(props){
        super(props);
        this.state = {
          citys: [],
          waitFetch: true,
          errMessage: ''
        };
    }

    componentDidMount(){
      this._GetPM25Data();
    }

    // 取的PM2.5資料
    _GetPM25Data = () => {
      return fetch(PM25_API)
      .then(res => res.json())
      .then(resbody => this.setState({ citys: resbody, waitFetch: false }))
      .catch(err => this.setState({ errMessage: err, waitFetch: false }))
    }

    render(){
      const { citys, waitFetch, errMessage } = this.state;
        return(
          <div>
            {(waitFetch)
              ? <span id={'LoadingSpan'}>資料抓取中...</span>
              : (errMessage.length !== 0)
                ? <span>{`資料抓取失敗，錯誤訊息: ${errMessage}`}</span>
                : <PM25Table citys={citys}/>}
          </div>
        );
    }
}

export default App