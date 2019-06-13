import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { counterAction, increaseCount, decreaseCount } from "../actions/counter";

const Index = () => {

    const count = useSelector(state => state.counterReducer.count);
    const dispatch = useDispatch();
    const [payload, setPayload] = useState(0);

    return (
        <div>
            <span>current count : {count}</span>
            <input type="number" onChange={(e) => setPayload(+e.target.value)}/><br/>
            <button onClick={() => dispatch(increaseCount(payload))}>Increase</button><br/>
            <button onClick={() => dispatch(decreaseCount(payload))}>decrease</button>
        </div>
    )
};

export default Index;