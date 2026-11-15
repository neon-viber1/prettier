type A = {     /** a */ a: 0 };
type B = {
  /** a */
  a: 0;
};
type C = { a: 0; /** b */ b: 1 };
type D = { /* a */ a: 0 };
type E = {};
type H = { a: 0, /** b */ b: 1; c: 2 };
type I = { /** a */ };
type F = Foo<{ /** a */ a: 0 }>;
interface G { /** a */ a: 0 }
