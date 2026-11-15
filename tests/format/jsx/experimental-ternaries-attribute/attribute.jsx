const foo1 = (
  <Foo
    prop={
      bar ? "bar"
      : baz ?
        "baz"
      : <Bar
          prop={"This is a really long value to make sure that this wraps"}
        />
    }
  />
);

const foo2 = (
  <Foo
    prop={
      bar ? "bar"
      : baz ?
        "baz"
      : <Bar
          prop={"This is a really long value to make sure that this wraps"}
        />
      //comment
    }
  />
);

const foo3 = (
  <Foo
    prop={
      bar ? "bar"
      : baz ?
        "baz"
      : <Bar
          prop={"This is a really long value to make sure that this wraps"}
        />
      /* comment */
    }
  />
);
