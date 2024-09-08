import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

// export default function configureStore(initialState) {
//     const store = createStore(rootReducer, initialState);
//
//     if (module.hot) {
//         // Enable Webpack hot module replacement for reducers
//         module.hot.accept('../reducers', () => {
//             const nextRootReducer = require('./reducers');
//             store.replaceReducer(nextRootReducer);
//         });
//     }
//
//     return store;
// }

let store = createStore(rootReducer , applyMiddleware(thunk) );

export default store;
