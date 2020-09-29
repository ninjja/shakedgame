import React, { Component } from 'react';
import { Progress } from 'antd';

const pad = (n, width, z) => {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

export default class Timer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            minutes: props.minutes,
            seconds: props.seconds || 0,
            started: false
        }
    }

    start = () => {
        if (!this.state.started) {
            this.setState({ started: true, seconds: this.props.seconds, minutes: this.props.minutes });

            this.myInterval = setInterval(() => {
                const {minutes, seconds} = this.state;

                if (seconds > 0) {
                    this.setState(({ seconds }) => ({ seconds: seconds - 1 }));
                }

                if (seconds === 0) {
                    if (minutes === 0) {
                        this.setState({ started: false });
                        clearInterval(this.myInterval);
                        this.props.onEnd && this.props.onEnd();
                    }
                    else {
                        this.setState(({ minutes }) => ({ minutes: minutes - 1, seconds: 59 }));
                    }
                }
            }, 1000);
        }
    }

    res = () => {
        this.setState({ started: false, seconds: this.props.seconds, minutes: this.props.minutes }, () => {
            clearInterval(this.myInterval);
            this.start();
        });
    }

    end = () => {
        this.setState({ started: false }, () => {
            clearInterval(this.myInterval);
        });
    }

    render() {
        const { minutes, seconds } = this.state;
        const { seconds: initSeconds } = this.props;

        return (<>
            {true
                ? <Progress type="circle" percent={seconds * 100 / initSeconds} format={percent => seconds > 0 ? `${pad(seconds, 2)} שניות` : 'עבר הזמן'} />
                : <>
                    {minutes === 0 && seconds === 0
                        ? <strong style={{color: 'red'}}>נגמר הזמן</strong>
                        : <span>{pad(minutes, 2)}:{pad(seconds, 2)} דקות</span>}
                </>}
        </>);
    }
}
