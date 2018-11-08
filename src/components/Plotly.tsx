import React from 'react';
import Plot from 'react-plotly.js';
import ApiService from '../services/ApiService';

// to replace Graph (d3) w/ a Plotly plot (easier to use)

interface IProps {
}

interface IState {
  weatherData: number;
  data: any;
  layout: any;
}

export default class Plotly extends React.Component<IProps, IState> {
  width: 960;
  height: 500;
  title: 'Test Plot';
  timer: any;
  x: any[];
  y: any[];
  // @ts-ignore
  private apiService: any;

  constructor(props: IProps) {
    super(props);

    this.x = [0, 0];
    this.y = [0, 0];

    this.state = {
      weatherData: 0,
      data: [{
        x: this.x,
        y: this.y,
        type: 'scatter',
        mode: 'lines',
        marker: { color: 'red' },
      }],
      layout: {
        width: 960,
        height: 500,
        autoSize: true,
        staticPlot: false,
        title: 'Test Plot',
        xaxis: {
          title: 'Timestamp',
        },
        yaxis: {
          title: 'Humidity (%)',
          range: [0, 100],
        },
      },
    };

    this.setGraphData = this.setGraphData.bind(this);
    this.tick = this.tick.bind(this);

    this.apiService = new ApiService({
      functions: {
        'setData': this.setGraphData,
      },
    });
  }

  componentDidMount() {
    this.timer = setInterval(this.tick, 10000); // update every 10 seconds
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  public async setGraphData(input: any) {
    let humidity = input.main.humidity.toString(); // parsing out weather data api response
    await this.setState({
      weatherData: humidity,
    });
  }

  tick() {
    let data = this.state.data;
    let x = data[0].x.slice();
    let y = data[0].y.slice();

    x.push(Date.now());
    y.push(this.state.weatherData);

    data[0].x = x;
    data[0].y = y;

    this.setState({
      data: data,
    });

    console.log(`Plotly.tick() - x is ${x}`);
    console.log(`Plotly.tick() - y is ${y}`);
  }

  render() {
    return (
      <Plot
        data={this.state.data}
        layout={this.state.layout}
        onInitialized={(figure) => this.setState(figure)}
        onUpdate={(figure) => { this.setState(figure); }}
      />
    );
  }
}