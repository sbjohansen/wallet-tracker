import fetch from 'isomorphic-fetch';
import { LCDClient, Coins } from '@terra-money/terra.js';
import player from 'play-sound';

const gasPrices = await (await fetch('https://api.terrarebels.net/gas-prices')).json();
const gasPricesCoins = new Coins(gasPrices);
const lcd = new LCDClient({
  URL: 'https://terra-classic-lcd.publicnode.com/',
  chainID: 'columbus-5',
  isClassic: true,
  gasPrices: gasPricesCoins,
  gasAdjustment: 1.5,
  gas: 10000000,
});

const addresses = ['terra19yrq0mehjfk5cquxn4svjxft4rmhcc9g8t0yma', 'terra1ys3qrr8ngvypypqrucmc2v5522lz8245qhcj78'];
let prevBalances = {};

function playSoundEffect() {
  player().play('./sound.mp3', (err) => {
    if (err) {
      console.error(`Error playing sound: ${err.message}`);
    } else {
      console.log('Sound effect played!');
    }
  });
}

const checkBalance = async (address) => {
  const [balance] = await lcd.bank.balance(address).catch((error) => {
    console.log(error);
  });
  console.log(`${address} balance: ${balance.toString()}`);

  if (prevBalances[address] && prevBalances[address].toString() !== balance.toString()) {
    playSoundEffect();
  }
  prevBalances[address] = balance;
};

setInterval(async () => {
  for (let i = 0; i < addresses.length; i++) {
    await checkBalance(addresses[i]);
  }
}, 5000);
