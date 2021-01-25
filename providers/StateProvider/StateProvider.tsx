import { createContext, useContext, useReducer } from "react";
import { initialState } from "./StateReducer";

type ProviderProps = {
    reducer: any,
    initialState: any,
    children: any
}

export const StateContext = createContext(initialState)

export default function StateProvider({ reducer, initialState, children }: ProviderProps) {
    return (
        <StateContext.Provider value={useReducer(reducer, initialState) as any}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateValue = () => useContext(StateContext)