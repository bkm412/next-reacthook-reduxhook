Welcome file
Welcome file
# 작업순서
## 1. next 설치

```javascript
$ yarn add next react react-dom
```

## 2. package.json 수정

```javascript
{
	...,
	"script" : {
		"dev": "next",  
		"build": "next build",  
		"start": "next start"	
	}
}
```

## 3. _app.js, _document.js 커스터마이징
provider를 제공하기 위해 _app.js를 상속해줍니다.
styled-components SSR을 위해 _document.js도 같이 상속해주겠습니다.

먼저 root에 `pages`폴더를 생성합니다.
`pages` 폴더에 `_app.js` 와 `_document.js`파일을 생성해주고 아래코드를 붙여넣습니다.

##### ./pages/_app.js
```javascript
import React from 'react'
import App, { Container } from 'next/app'

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    )
  }
}

export default MyApp
```

##### ./pages/_document.js
```javascript
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
```

## 4. index page 생성 및 중간체크

##### ./pages/index.js
```javascript
import React from 'react';  
  
const Index = () => {  
	return (  
		<div>  
			Welcome to Index Page.  
		</div>  
	)  
};  

export default Index;
```

##### 중간 확인
```
$ yarn dev
# check http://localhost:3000
```

## 5. redux 설치
```javascript
$ yarn add redux react-redux
```

## 6.redux action 생성 

##### ./actions/counter.js
```javascript
export const counterAction = {  
    INCREASE: "INCREASE",  
    DECREASE: "DECREASE"  
}  
  
export const increaseCount = (count) => {  
    return {  
        type : counterAction.INCREASE,  
		payload : count  
    }  
}  
  
export const decreaseCount = (count) => {  
    return {  
        type : counterAction.DECREASE,  
	    payload : count  
    }  
}
```
type의 자동완성을 위해 따로 action을 선언해주었습니다.

## 7.redux reducer 생성

##### ./reducers/counter.js
```javascript
import { counterAction } from '../actions/counter';  
  
const initialState = {  
    count : 0  
}  
  
export default (state = initialState, action) => {  
    switch (action.type) {  
        case counterAction.INCREASE : {  
            return {  
                ...state,  
		        count : state.count + action.payload  
		     }  
        }  
        case counterAction.DECREASE : {  
            return {  
                ...state,  
			    count : state.count - action.payload  
		    }  
        }  
        default :  
            return state;  
    }  
}
```

##### ./reducers/index.js
```javascript
import { combineReducers } from 'redux';  
import counterReducer from './counter';  
  
  
export default combineReducers({  
    counterReducer  
});
```

reducer는 관리요소별로 관리하는게 훨씬 가독성이 좋다고 생각해서 reducer를 분리 후 index에서 combine해줍니다.

## 8.redux store 생성

##### ./store.js
```javascript
import { createStore } from 'redux';  
import rootReducer from './reducers/index';  
  
export default createStore(rootReducer);
```

병합한 reducer로 store를 생성해서 export 해주겠습니다.
middleware를 사용하실 분들은 여기에 적용하시면 됩니다.

## 9. Provider 생성

##### ./pages/_app.js
```javascript
import {Provider} from 'react-redux';
import store from '../store';

//...
return (  
	<Container>  
		<Provider store={store}>  
			<Component {...pageProps} />  
		</Provider>
	</Container>
)
```

Provider와 아까 8번에서 생성한 store를 import 해준 뒤에
Provider로 Component를 감싸고 store를 props로 넘겨줍니다.

## 10. redux 사용

이제 기본적인 redux 사용을 시작할 수 있습니다.
react-redux가 hooks를 적용하면서 좀 더 가독성이 좋고 편리한 코드를 사용할 수 있게 되었습니다.

#### store에서 값 가져오기 (기존 mapStateToProps)
```javascript
import {useSelector} from 'react-redux';

const count = useSelector(state => state.counterReducer.count);
```
useSelector를 사용해서 콜백에서 찾는 값을 return해줍니다.

#### store 업데이트 시키기 (기존 dispatch)
```javascript
import {useDispatch} = 'react-redux';

const dispatch = useDispatch();
```

간단히 useDispatch를 사용하는 것 만으로 dispatch를 사용할 수 있습니다.

##### test code (./pages/index.js)
```javascript
import React, {useState} from 'react';  
import {useSelector, useDispatch} from 'react-redux';  
import {counterAction, increaseCount, decreaseCount} from "../actions/counter";  
  
const Index = () => {  
  
     const count = useSelector(state => state.counterReducer.count);  
	 const dispatch = useDispatch();  
	 const [payload, setPayload] = useState(0);  
  
return (  
	<div>  
		<span>current count : {count}</span>  
		<input type="number" onChange={(e) => setPayload(+e.target.value)}/><br/>  
		<button onClick={() => dispatch({type : counterAction.INCREASE, payload})}>Increase</button><br/>  
		<button onClick={() => dispatch({type : counterAction.DECREASE, payload})}>decrease</button>  
		//or
		//<button onClick={() => dispatch(increaseCount(payload))}>Increase</button><br/>  
		//<button onClick={() => dispatch(decreaseCount(payload))}>decrease</button>
	</div>  
	)  
};  
  
export default Index;
```

기존처럼 사용할 컴포넌트를 connect할 필요 없이 편리하게 사용할 수 있게 되었습니다.

더 자세한 사항은 [React-redux - hooks]([https://react-redux.js.org/next/api/hooks](https://react-redux.js.org/next/api/hooks)) 를 참고하세요.

감사합니다.
작업순서
1. next 설치
$ yarn add next react react-dom
2. package.json 수정
{
	...,
	"script" : {
		"dev": "next",  
		"build": "next build",  
		"start": "next start"	
	}
}
3. _app.js, _document.js 커스터마이징
provider를 제공하기 위해 _app.js를 상속해줍니다.
styled-components SSR을 위해 _document.js도 같이 상속해주겠습니다.

먼저 root에 pages폴더를 생성합니다.
pages 폴더에 _app.js 와 _document.js파일을 생성해주고 아래코드를 붙여넣습니다.

./pages/_app.js
import React from 'react'
import App, { Container } from 'next/app'

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    )
  }
}

export default MyApp
./pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
4. index page 생성 및 중간체크
./pages/index.js
import React from 'react';  
  
const Index = () => {  
	return (  
		<div>  
			Welcome to Index Page.  
		</div>  
	)  
};  

export default Index;
중간 확인
$ yarn dev
# check http://localhost:3000
5. redux 설치
$ yarn add redux react-redux
6.redux action 생성
./actions/counter.js
export const counterAction = {  
    INCREASE: "INCREASE",  
    DECREASE: "DECREASE"  
}  
  
export const increaseCount = (count) => {  
    return {  
        type : counterAction.INCREASE,  
		payload : count  
    }  
}  
  
export const decreaseCount = (count) => {  
    return {  
        type : counterAction.DECREASE,  
	    payload : count  
    }  
}
type의 자동완성을 위해 따로 action을 선언해주었습니다.

7.redux reducer 생성
./reducers/counter.js
import { counterAction } from '../actions/counter';  
  
const initialState = {  
    count : 0  
}  
  
export default (state = initialState, action) => {  
    switch (action.type) {  
        case counterAction.INCREASE : {  
            return {  
                ...state,  
		        count : state.count + action.payload  
		     }  
        }  
        case counterAction.DECREASE : {  
            return {  
                ...state,  
			    count : state.count - action.payload  
		    }  
        }  
        default :  
            return state;  
    }  
}
./reducers/index.js
import { combineReducers } from 'redux';  
import counterReducer from './counter';  
  
  
export default combineReducers({  
    counterReducer  
});
reducer는 관리요소별로 관리하는게 훨씬 가독성이 좋다고 생각해서 reducer를 분리 후 index에서 combine해줍니다.

8.redux store 생성
./store.js
import { createStore } from 'redux';  
import rootReducer from './reducers/index';  
  
export default createStore(rootReducer);
병합한 reducer로 store를 생성해서 export 해주겠습니다.
middleware를 사용하실 분들은 여기에 적용하시면 됩니다.

9. Provider 생성
./pages/_app.js
import {Provider} from 'react-redux';
import store from '../store';

//...
return (  
	<Container>  
		<Provider store={store}>  
			<Component {...pageProps} />  
		</Provider>
	</Container>
)
Provider와 아까 8번에서 생성한 store를 import 해준 뒤에
Provider로 Component를 감싸고 store를 props로 넘겨줍니다.

10. redux 사용
이제 기본적인 redux 사용을 시작할 수 있습니다.
react-redux가 hooks를 적용하면서 좀 더 가독성이 좋고 편리한 코드를 사용할 수 있게 되었습니다.

store에서 값 가져오기 (기존 mapStateToProps)
import {useSelector} from 'react-redux';

const count = useSelector(state => state.counterReducer.count);
useSelector를 사용해서 콜백에서 찾는 값을 return해줍니다.

store 업데이트 시키기 (기존 dispatch)
import {useDispatch} = 'react-redux';

const dispatch = useDispatch();
간단히 useDispatch를 사용하는 것 만으로 dispatch를 사용할 수 있습니다.

test code (./pages/index.js)
import React, {useState} from 'react';  
import {useSelector, useDispatch} from 'react-redux';  
import {counterAction, increaseCount, decreaseCount} from "../actions/counter";  
  
const Index = () => {  
  
     const count = useSelector(state => state.counterReducer.count);  
	 const dispatch = useDispatch();  
	 const [payload, setPayload] = useState(0);  
  
return (  
	<div>  
		<span>current count : {count}</span>  
		<input type="number" onChange={(e) => setPayload(+e.target.value)}/><br/>  
		<button onClick={() => dispatch({type : counterAction.INCREASE, payload})}>Increase</button><br/>  
		<button onClick={() => dispatch({type : counterAction.DECREASE, payload})}>decrease</button>  
		//or
		//<button onClick={() => dispatch(increaseCount(payload))}>Increase</button><br/>  
		//<button onClick={() => dispatch(decreaseCount(payload))}>decrease</button>
	</div>  
	)  
};  
  
export default Index;
기존처럼 사용할 컴포넌트를 connect할 필요 없이 편리하게 사용할 수 있게 되었습니다.

더 자세한 사항은 React-redux - hooks 를 참고하세요.

감사합니다.

Markdown 5412 bytes 646 words 267 lines Ln 253, Col 6 HTML 3734 characters 593 words 180 paragraphs
