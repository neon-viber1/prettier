function testA() {
  return !(
    test1 ||
    // comment in middle
    test2 ||
    // etc ...
    test3
  );
}

function testB() {
  return !(
    // comment at start
    test1 ||
    // etc ...
    test2 ||
    test3
  );
}

function testC() {
  return !(
    // comment a
    // comment b
    test1 ||
    // etc ...
    test2 ||
    test3
  );
}

function testD() {
  return typeof (
    // comment at start
    test1 &&
    // etc ...
    test2 ||
    test3
  );
}
