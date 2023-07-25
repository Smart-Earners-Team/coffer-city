export const getDuration = (timestamp: number) => {

    const days = timestamp / 86400;

    const duration = `${days}`

    return duration;
}
