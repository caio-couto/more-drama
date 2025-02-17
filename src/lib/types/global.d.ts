declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.toJSON = function () {
  return this.toString();
}

export default global;