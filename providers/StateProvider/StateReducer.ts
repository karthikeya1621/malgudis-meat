export const initialState = []

const reducer = (state: any[], action: any) => {
    switch (action.type) {
        case 'UPDATE_CHOICES':
            if (state.filter(c => c.variant === action.payload.variant).length) {
                return [...state]
            }
            else {
                setStateLocal([...state, action.payload])
                return [...state, action.payload]
            }
        case 'GET_CHOICES':
            return [...state]
        case 'SYNC_CHOICES':
            setStateLocal([...state, ...action.payload])
            return [...state, ...action.payload]
        default:
            return [...state]
    }
}

export const isStateLocal = async (): Promise<boolean> => {
    return (new Promise((resolve) => {
        const data = localStorage.getItem('prodvars')
        if (data) {
            const result = JSON.parse(data)
            if (result instanceof Array) {
                if (result.length) {
                    resolve(true)
                }
            } else {
                resolve(false)
            }
        } else {
            resolve(false)
        }
    }))
}

export const setStateLocal = async (state: any[]): Promise<void> => {
    return (new Promise((resolve) => {
        localStorage.setItem('prodvars', JSON.stringify(state))
        resolve()
    }))
}

export const getStateLocal = async (): Promise<any[]> => {
    return (new Promise((resolve) => {
        if (localStorage.getItem('prodvars')) {
            resolve(JSON.parse(localStorage.getItem('prodvars') as string))
        } else {
            resolve([])
        }

    }))
}

export default reducer