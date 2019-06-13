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