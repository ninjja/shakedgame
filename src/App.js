import React, { createRef, useState, useEffect } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import { Progress } from 'antd';
import { Button } from 'antd';
import { HeartTwoTone } from '@ant-design/icons';
import { allItems } from './items';
import Timer from './Timer';
import Item from './Item';
import { TRIES, PRESET } from './consts';

import './style.scss';

const getPreset = (level) => PRESET[Math.max(Math.min(level - 1, PRESET.length - 1), 0)];

const TOYS_COUNT = (level) => getPreset(level).toys;
const TIME_SEC = (level) => getPreset(level).time;
const ITEM_SIZE = (level) => getPreset(level).itemSize;
const BOARD_SIZE = (level) => getPreset(level).boardSize;

const ShakedGame = () => {
    const [toys, setToys] = useState([]);
    const [items, setItems] = useState([]);
    const [started, setStarted] = useState(false);
    const [tries, setTries] = useState(TRIES);
    const [score, setScore] = useState(0);
    const [clicked, setClicked] = useState([]);
    const [level, setLevel] = useState(1);

    const timer = createRef();

    useEffect(() => {
        const _score = (_.uniq(clicked).length * 100) / Math.max(TOYS_COUNT(level), 1);

        setScore(parseInt(_score));

        if (_score === 100) {
            setStarted(false);
            timer.current.end();
        }

        const success = _.uniq(clicked).length;

        if (success === TOYS_COUNT(level)) {
            setStarted(false);
            timer.current.end();
        }
    }, [clicked]);

    useEffect(() => {
        clicked.map((item) => {
            document.querySelector(`.${item}`).style.display =  'inline-block';
        });
        setClicked([]);
    }, [items]);

    useEffect(() => {
        if (tries === 0) {
            setStarted(false);
            timer.current.end();
        }
    }, [tries]);

    useEffect(() => {
        if (started) {
            setClicked([]);
            setScore(0);
            // setTries(TRIES);

            timer.current.start();
        }
    }, [started]);

    const handleItemClick = (toys, item) => {
        if (toys.includes(item)) {
            setClicked((oldClicked) => [...oldClicked, item.title]);

            document.querySelector(`.${item.title}`).style.display =  'none';
        }
        else {
            setTries((oldTries) => oldTries - 1);
        }
    }

    const handleTimeEnd = () => {
        setStarted(false);
    }

    const start = () => {
      const _level = level+1;
        const _toys = allItems.map(x => ({ x, r: Math.random() }))
            .sort((a, b) => a.r - b.r)
            .map(a => a.x)
            .slice(0, TOYS_COUNT(_level));

        const _items = allItems.map((item) => {
            const left = (Math.random() * (BOARD_SIZE(_level) - ITEM_SIZE(_level))).toFixed();
            const top = (Math.random() * (BOARD_SIZE(_level) - ITEM_SIZE(_level))).toFixed();

            return (
              <Item onClick={() => handleItemClick(_toys, item)}
                key={item.title}
                classNames={[item.title, { toy: _toys.includes(item) }]}
                url={item.url}
                style={{
                    left: `${left}px`,
                    top: `${top}px`
                }}/>);
        });

        setItems(_items);
        setToys(_toys);
        setStarted(true);
        setLevel((currentLevel) => (score === 100) ? currentLevel + 1 : 1);
    }

    return (<div className="shaked-game" style={{ minWidth: BOARD_SIZE(level) + 50, maxWidth: BOARD_SIZE(level) + 50 }}>
        <h2>המשחק של שקד</h2>
        <p>יש למצוא את כל הפריטים מהרשימה וללחוץ עליהם בתוך אוסף כל הפריטים</p>

        <div className="game-panel">

            שלב: {level}
            <div><Timer circle seconds={TIME_SEC(level)} minutes={0} ref={timer} onEnd={handleTimeEnd}/></div>

            {tries >= 0 && <div className="tries">
                {_.range(TRIES-tries).map(i => <HeartTwoTone key={i} style={{fontSize: 26}} twoToneColor="#cccccc" />)}
                {_.range(tries).map(i => <HeartTwoTone key={i} style={{fontSize: 26}} twoToneColor="#ff0000" />)}
            </div>}

            <div className="game-score">{score}%</div>
            <Progress percent={score} status="active" className="score" />

            {!started &&
              <Button type="primary" onClick={() => start()}>התחל משחק</Button>}
        </div>

        <main>
            {started && <aside>
                <h3>רשימת הפריטים</h3>

                {toys.map((item) => (<Item key={item.title} classNames={['toy']} title={item.title} url={item.url} style={{position: 'static'}}/>))}
            </aside>}

            {(started || score > 0 || tries < TRIES) && (<div className={classnames(['main-game'])}
                    style={{ minWidth: BOARD_SIZE(level), width: BOARD_SIZE(level), minHeight: BOARD_SIZE(level), height: BOARD_SIZE(level) }}>

                    {score === 100 && <div className="hoorai">כל הכבוד הצלחת למצוא את הכל! <Button type="primary" onClick={() => start()}>לשלב הבא</Button></div>}
                    {!started && score < 100 && tries > 0 && <div className="hoorai">כמעט! הגעת לשלב {level} והצלחת למצוא {score}%.</div>}
                    {!started && tries === 0 && <div className="hoorai">נגמרו לך הפסילות, הגעת לשלב {level} ומצאת {score}%.</div>}

                    {items}
                </div>)}
        </main>
    </div>);
}

export default ShakedGame;