function main(options:{
  a:number,b:number}) {
  return null
}

type Options = {
  a:number,b:number}

function single(options: { a: number, b: number }) {}

const arrow = (options:{
  a:number,b:number}) => {};

class A {
  method(options:{
    a:number,b:number}) {}
}

function multi(x: number, options:{
  a:number,b:number}) {}
