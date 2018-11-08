import React, { Component } from 'react';
import * as d3 from 'd3';
interface IProps {
}
interface IState {
}

export default class Graph extends Component<IProps, IState> {
  ref: SVGSVGElement;
  width: '960';
  height: '500';

  componentDidMount() {
    console.log('graph');

    d3.select(this.ref)
      .append('g');
      // .attr('r', 5)
      // .attr('cx', parseInt(this.width, 10) / 2)
      // .attr('cy', parseInt(this.height, 10) / 2)
      // .attr('fill', 'red');
  }

  newData(lineNumber: number, points: number) {
    return d3.range(lineNumber).map(function() {
      return d3.range(points).map(function(item, index) {
        return { x: index, y: Math.random() * 100 };
      });
    });
  }

  render() {
    // get new data
    // @ts-ignore
    let data = this.newData(8, 3); // going forward, hook this up to the pubnub stream
    // yScale.domain([0,100]);
    return (
      <svg className='container' ref={(ref: SVGSVGElement) => this.ref = ref}
        width={this.width} height={this.height}>
      </svg>
    );
  }
}