// @ts-ignore
import * as HttpStatus from 'http-status-codes';
// @ts-ignore
import SleepUtil from './SleepUtil';

import { ConfigGlobalLoader } from '../config/ConfigGlobal';

interface IProps {
  functions: any;
}

export default class ApiService {
  // @ts-ignore
  private stopping: boolean = false;
  private publishing: boolean = false;
  // @ts-ignore
  private readonly configGlobal = ConfigGlobalLoader.config;
  // @ts-ignore
  private readonly props: IProps;
  private lastCheckTime: number;

  constructor(props: IProps) {
    console.log(`ApiService.constructor()`);
    this.props = props;

    this.StartPublishing();
  }

  //
  // Interface functions
  //

  public StartPublishing() {
    console.log(`ApiService.StartPublishing()`);

    if (this.publishing) return;

    this.publishing = true;

    // Start the data loop - don't await this because it runs forever
    this.GetDataToPublish();
  }

  StopPublishing() {
    this.stopping = true;
  }

  public async getDataUrl() {
    // for now, this will be the weather api
        // later, replace this with non-weather data -> just thingy data?
    // or compare thingy data (temp & humidity) to real weather data
    let zipCode = this.configGlobal.weatherZipCode; // 11205: brooklyn
    let weatherApiKey = this.configGlobal.weatherKey;
    let weatherApi = 'http://api.openweathermap.org/data/2.5/weather?zip=' + zipCode + ',us&APPID=' + weatherApiKey;
    return weatherApi;
  }

/*
  public async sendToPubnub() {
    // if i want to publish to the channel without using the Pubnub component
    const pubKey = this.configGlobal.pubKey;
    const subKey = this.configGlobal.subKey;
    const channel = 'thingyinfo';
    // @ts-ignore
    const key = value.toString();
    const message = JSON.stringify({
      'eon':
        { key : value},
    });
    const encodedMessage = encodeURIComponent(message);
    const url = 'https://ps.pndsn.com/publish/' + pubKey + '/' + subKey + '/0/' + channel + '/myCallback/' + encodedMessage + '?store=0&uuid=db9c5e39-7c95-40f5-8d71-125765b6f563';
    try {
      let result = await fetch(url, {
        method: 'GET',
      });
       console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
*/
  // below: general structure for API calls & responses
  private async GetDataToPublish() {
    let url = await this.getDataUrl(); // for weather
    let dataToPublish = await this.GetDataAsync(url);

    if (dataToPublish !== undefined) {
      await this.props.functions.setData(dataToPublish);
    }

    this.lastCheckTime = Date.now();

    while (true) {
        if (this.stopping) return;

        let now = Date.now();
        if ((now - this.lastCheckTime) > 15000) { // every 15 seconds
        dataToPublish = await this.GetDataAsync(url); // for weather

          if (dataToPublish !== undefined) {
            await this.props.functions.setData(dataToPublish);
          }

          this.lastCheckTime = Date.now();
        }

      await SleepUtil.SleepAsync(1000);
    }

  }

  private async GetDataAsync(url: string) {
    let response = undefined;
    try {
      response = await fetch(url, {
        method: 'GET',
        headers: {
          // 'Accept': '*/*',
          // 'Access-Control-Allow-Origin': '*',
        },
      });

      if (this.stopping) return undefined;

      // Bail if status code is not OK
      if ((response.status).toString() !== (HttpStatus.OK).toString()) return undefined;

      // Read response
      response = await response.json();

    } catch (error) {
      console.log('Caught exception: ' + JSON.stringify(error));
    }

    return response;
  }

}