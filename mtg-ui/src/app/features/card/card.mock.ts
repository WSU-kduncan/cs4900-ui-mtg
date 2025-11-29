import { Card } from '../../shared/models/card.model';

export const CARD_MOCK: Card[] = [
  { cardNumber: 1, setName: 'LEA',  cardName: 'Black Lotus',                  cardType: 'Artifact',  manaValue: 0, price: 25000, stock: 1 },
  { cardNumber: 2, setName: 'LEB',  cardName: 'Mox Sapphire',                 cardType: 'Artifact',  manaValue: 0, price: 8500,  stock: 2 },
  { cardNumber: 3, setName: '2XM',  cardName: 'Lightning Bolt',               cardType: 'Instant',   manaValue: 1, price: 3.5,   stock: 120 },
  { cardNumber: 4, setName: 'MPS',  cardName: 'Sol Ring',                     cardType: 'Artifact',  manaValue: 1, price: 2.0,   stock: 300 },
  { cardNumber: 5, setName: 'MH2',  cardName: 'Ragavan, Nimble Pilferer',     cardType: 'Creature',  manaValue: 1, price: 68,    stock: 14 },
  { cardNumber: 6, setName: 'GRN',  cardName: 'Teferi, Hero of Dominaria',    cardType: 'Planeswalker', manaValue: 5, price: 24, stock: 9 },
  { cardNumber: 7, setName: 'KHM',  cardName: 'Goldspan Dragon',              cardType: 'Creature',  manaValue: 5, price: 18,    stock: 7 },
  { cardNumber: 8, setName: 'DMU',  cardName: 'Sheoldred, the Apocalypse',    cardType: 'Creature',  manaValue: 4, price: 70,    stock: 3 },
  { cardNumber: 9, setName: 'NEO',  cardName: 'Fable of the Mirror-Breaker',  cardType: 'Enchantment', manaValue: 3, price: 16, stock: 20 },
  { cardNumber: 10, setName: 'MID', cardName: 'Consider',                     cardType: 'Instant',   manaValue: 1, price: 1.2,   stock: 200 },
];
