module.exports = {
  cacheStores: ({FileStore}) => {
    return [new FileStore({root: __dirname})];
  },
} /*:: as InputConfigT*/;

foo() /*:: as T*/;

a /*:: as T*/
b;

function f() {
  return a /*:: as T*/;
}

c; /*:: as T*/

d /* plain */;
