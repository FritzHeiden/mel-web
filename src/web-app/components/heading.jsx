import React from 'react';

export default class Heading extends React.Component {
    constructor(props) {
        super();
        this.props = props;
    }

    render() {
        return <h1 style={style}>{this.props.children}</h1>
    }
}

const style = {
    fontFamily: 'Roboto',
    color: '#858388',
};