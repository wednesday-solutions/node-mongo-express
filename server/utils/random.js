export function randomiser(arr, numberOfElements) {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, numberOfElements);
    return selected;
}
