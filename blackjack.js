let sum = Math.floor(Math.random() * 10 + 1) + Math.floor(Math.random() * 10 + 1);

if (sum > 21) {
    console.log('You lost');
}

console.log(`You have ${sum} points`);

let bankSum = Math.floor(Math.random() * 10 + 1) + Math.floor(Math.random() * 10 + 1);

while(bankSum < 17){
    console.log(`Dealer has ${bankSum} points -> under 17`);
    bankSum += Math.floor(Math.random() * 10 + 1);
}

console.log(`Dealer has ${bankSum} points`);

if (bankSum > 21 || (sum <= 21 && sum > bankSum)) {
    console.log('You win');
} else if (bankSum === sum) {
    console.log('Draw..');
} else {
    console.log('Bank wins');
}