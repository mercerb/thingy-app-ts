import React from 'react';
import Plot from 'react-plotly.js';

// to replace Graph (d3) w/ a Plotly plot (easier to use)

interface IProps {

}

interface IState {
  currValue: number;
  data: any;
  layout: any;
}

class Plotly extends React.Component<IProps, IState> {
  width: 960;
  height: 500;
  title: 'Test Plot';
  timer: any;
  x: any[];
  y: any[];

  constructor(props: IProps) {
    super(props);

    this.x = [0, 0];
    this.y = [0, 0];

    this.state = {
      currValue: 0,
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
        staticPlot: true,
        title: 'Test Plot',
      },
    };

    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.tick, 5000); // update every 5 seconds
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick() {
    let data = this.state.data;
    let x = data[0].x.slice();
    let y = data[0].y.slice();

    x.push(Math.floor((Math.random() * 100) + 1));
    y.push(Math.floor((Math.random() * 100) + 1));

    data[0].x = x;
    data[0].y = y;
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

export default Plotly;