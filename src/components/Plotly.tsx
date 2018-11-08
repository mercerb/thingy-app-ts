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
  frames: any;
}

export default class Plotly extends React.Component<IProps, IState> {
  title: 'Realtime Humidity in Brooklyn from OpenWeatherAPI';
  timer: any;
  x: any[];
  y: any[];
  // @ts-ignore
  private apiService: any;

  constructor(props: IProps) {
    super(props);

    let initialDate = Date.now();
    this.x = [initialDate, initialDate + 1];
    this.y = [50, 50];

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
        title: 'Brooklyn Humidity: Realtime Data Stream',
        xaxis: {
          title: 'Timestamp',
        },
        yaxis: {
          title: 'Humidity (%)',
          range: [0, 100],
        },
      },
      frames: [],
    };

    this.setGraphData = this.setGraphData.bind(this);

    this.apiService = new ApiService({
      functions: {
        'setData': this.setGraphData,
      },
    });
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      let newRealtimeData = [...this.state.data];
      let date = Date.now();
      // let dateStr = (new Date()).toTimeString();
      newRealtimeData[0].x.push(date);
      newRealtimeData[0].y.push(this.state.weatherData);

      const newLayout = Object.assign({}, this.state.layout);
      newLayout.datarevision++;
      this.setState({ data: newRealtimeData, layout: newLayout });

      console.log(`Plotly.update() - x is now ${newRealtimeData[0].x.slice()}`);
      console.log(`Plotly.update() - y is now ${newRealtimeData[0].y.slice()}`);

    }, 2000); // updates every 2 seconds
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

  render() {
    return (
      <Plot
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
        data={this.state.data}
        layout={this.state.layout}
        frames={this.state.frames}
        onInitialized={(figure) => this.setState(figure)}
        onUpdate={(figure) => { this.setState(figure); }}
      />
    );
  }
}