export function test() {
  console.log('Hello bundle');
}

export class TestClass {
  constructor() {
    console.log('constructor: ');
  }
}

// supported by the 'stage-0' preset
export class TestClass2 {
  static myProp1 = 'static prop';
  myProp2 = 'prop';
}

const test1 = new TestClass();
const test2 = new TestClass();

console.log(test1, test2);
