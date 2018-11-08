import React, { Component } from 'react';
import PubNubReact from 'pubnub-react';
import { ConfigGlobalLoader } from '../config/ConfigGlobal';
// @ts-ignore
import SleepUtil from '../services/SleepUtil';
import ApiService from '../services/ApiService';
import Plotly from './Plotly';

interface IProps {
}
interface IState {
  dataToPublish: any;
}

export default class Pubnub extends Component<IProps, IState> {
    private pubnub: any;
    // @ts-ignore
    private apiService: any;
    private readonly configGlobal = ConfigGlobalLoader.config;

    constructor(props: IProps) {
        super(props);

        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);

        this.setPubnubData = this.setPubnubData.bind(this);
        this.publishForever = this.publishForever.bind(this);

        this.pubnub = new PubNubReact({
            publishKey: this.configGlobal.pubKey,
            subscribeKey: this.configGlobal.subKey,
        });

        this.apiService = new ApiService({
          functions: {
            'setData': this.setPubnubData,
          },
        });

        this.state = {
          dataToPublish: [],
        };

        this.pubnub.init(this);
    }

    componentWillMount() {
        this.pubnub.subscribe({
            channels: ['channel1'],
            withPresence: true,
        });

        this.pubnub.getMessage('channel1', (msg: any) => {
            console.log(msg);
        });

        // this.pubnub.getStatus((st: any) => {
        //     this.pubnub.publish({
        //         message: 'initial message', // looks bad
        //         channel: 'channel1',
        //     });
        // });

        this.publishForever(); // don't await because it runs forever
    }

    componentWillUnmount() {
        this.pubnub.unsubscribe({
            channels: ['channel1'],
        });
    }

    public async setPubnubData(input: any) {
      let humidity = input.main.humidity.toString(); // parsing out weather data api response
      await this.setState({
        dataToPublish: humidity,
      });
    }

    private async publishForever() {
        while (true) {
          // let time = (Date.now()).toString(); // just print timestamp for testing
          let time = (new Date()).toTimeString();
          let msg = time.split(' ')[0] + ': Current humidity (%) in Brooklyn is ' + this.state.dataToPublish.toString();
          this.pubnub.publish({
            message: msg,
            channel: 'channel1',
          });

          await SleepUtil.SleepAsync(2000); // sleep 2 seconds
        }
    }

    render() {
        const messages = this.pubnub.getMessage('channel1');
        return (
            <div>
                <Plotly {...this.state.dataToPublish}/>
                <ul>
                    {messages.map((m: any, index: any) => <li key={'message' + index}>{m.message}</li>)}
                </ul>
            </div>
        );
    }
}