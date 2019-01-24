
async function asyncFunction(value) {
    return new Promise((resolve, reject) => {
        console.log('waiting');
        setTimeout(() => { resolve(value)}, 1000);
    })
}

async function otherFunction() {
    return await asyncFunction(10);
}

console.log('start');
otherFunction().then((value) => console.log(value));