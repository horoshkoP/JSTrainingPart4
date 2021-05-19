import { of, from, fromEvent, timer } from 'rxjs';
import {
  map,
  filter,
  mergeMap,
  debounce,
  last,
  debounceTime
} from 'rxjs/operators';
import { MOCK_CARS, MOCK_USERS } from './mock-data';

console.clear();

/* Task 1  **/
// Data Source
const dataSource = [3, 1, '939', null, 3, { numb: 3 }, undefined, 'number'];

let finSum: number = 0;
let testArr = [];

const source$ = from(dataSource);

const result$ = source$.pipe(
  filter(Number),

  map(el => {
    finSum += parseInt(el);
    return finSum;
  }),
  last()
);
// create variable result$ that sums all numbers in array
// extend with pipe operators, so that you will get expected result
// for example for array [1, 'a', 4, null, '8']
// you should get 1 + 4 + 8 = 13

// const result$ = source$.pipe()
result$.subscribe(value => console.log(value));
// expected result: 3 + 1 + 939 + 3 = 946

/* Task 2 **/
// Data Source
const fetchUsers = {
  users: MOCK_USERS
};

const fetchData$ = of(fetchUsers);

// lets imagine that it is some kind of http call
// that returns us some users

// you should create variable countUsers$
// it will return us number of users which name starts with 'a' or 'A' or 'c' or 'C'

let objArr = [];
const countUsers$ = fetchData$.pipe(
  map(el => {
    el.users.map(item => {
      let testName = item.first_name.toUpperCase();
      if (testName.startsWith('A') || testName.startsWith('C')) {
        objArr.push(testName);
      }
    });
    return `Amount of Users: ${objArr.length}`;
  })
);

// countUsers$.subscribe({
//   next: numberOfUsers => console.log(numberOfUsers)
// });

countUsers$.subscribe(numberOfUsers => console.log(numberOfUsers));

/* Task 3 **/
const cars$ = from(MOCK_CARS);

// lets imagine that you have web application that sells cars
// some user want to buy a car which price is less than 22000 (if its price is 22000 - it is ok for user)
// and not older than 4 years old (if its age is 4 - it is ok for user)
// so we need to filter all cars that are older or more expensive
// and also you should return cars as string
// '#model - #age: #price $'
// for example
// {
//   "age": 14,
//   "model": "Oldsmobile",
//   "price": 32966
// }
// this car you should return as 'Oldsmobile - 14: 32966 $'

const filteredCars$ = cars$.pipe(
  map(el => {
    let modelPrice = el.price;
    let modelAge = el.age;
    let modelName = el.model;

    if (modelPrice <= 22000 && modelAge <= 4) {
      return `${modelName} - ${modelAge}: ${modelPrice} $`;
    }
  })
);

filteredCars$.subscribe(car => {
  if (car !== undefined) {
    console.log(car);
  }
});

/* Task 4 **/
// Last one will be easy

const valueAEl = document.getElementById('valueA');
const valueBEl = document.getElementById('valueB');

let getVal1 = fromEvent(valueAEl, 'input');

let getVal2 = fromEvent(valueBEl, 'input');

// you need to calculate sum of values from both inputs
// only if they are both numbers and both are present
let result = 0;
const sum = getVal1.pipe(
  mergeMap(event1 => {
    let event1Val = event1.target.value;
    return getVal2.pipe(
      map(event2 => {
        let event2Val = event2.target.value;
        if (event2Val === '' && event1Val !== '') {
          return parseInt(event1Val);
        } else if (event1Val === '' && event2Val !== '') {
          return parseInt(event2Val);
        } else if (event2Val !== '' && event1Val !== '') {
          return parseInt(event2Val) + parseInt(event1Val);
        }
      })
    );
  }),
  debounceTime(500)
);

const sum$ = sum.subscribe(res => console.log(res));

// Tip: look for operators that somehow merge or combine streams
