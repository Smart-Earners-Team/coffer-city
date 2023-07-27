export const getDuration = (timestamp: number) => {

    const days = timestamp / 604800;

    const duration = `${days}`

    return duration;
}

export const useDateFromTimestamp = (timestamp: number): string => {
    const dateObject = new Date(timestamp * 1000); // JavaScript uses milliseconds

    const year = dateObject.getFullYear();
    const month = ("0" + (dateObject.getMonth() + 1)).slice(-2); // Months are 0-based in JS
    const date = ("0" + dateObject.getDate()).slice(-2);
    // const hours = ("0" + dateObject.getHours()).slice(-2);
    // const minutes = ("0" + dateObject.getMinutes()).slice(-2);
    // const seconds = ("0" + dateObject.getSeconds()).slice(-2);

    // return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
    return `${year}-${month}-${date}`;
}
