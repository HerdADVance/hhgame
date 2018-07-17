const {
	createStore,
	applyMiddleware,
} = require('redux')


// Action types
const TYPE = {
	INCREMENT: 'INCREMENT',
	DECREMENT: 'DECREMENT',
	SET_TIME: 'SET_TIME'
}

// Dummy reducer
const reducer = (
	state = null,
	action
) => state

// Middleware function that intercepts every ACTION and chackes if TYPE exists
// Allows action to be dispatched or throws error w/ message
const typeCheckMiddleware = api => next => action => {
	if(Reflect.has(TYPE, action.type)){
		next(action)
	} else{
		const err = new Error(
			`Type "${action.type}" is not a valid action type. Did you mean to use one of the following valid types? ` + 
			`"${Reflect.ownKeys(TYPE).join('"|"')}"`,
		)
		throw err
	}
}

// Store
const store = createStore(
	reducer,
	applyMiddleware(typeCheckMiddleware)
)

// Dispatch
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'MISTAKE' })