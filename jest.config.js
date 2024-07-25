/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	testEnvironment: "node",
	transform: {
	  "^.+.tsx?$": ["ts-jest", {}],
	},
	roots: ["<rootDir>/src/tests"],
	testMatch: ["<rootDir>/src/tests/**/*.(spec|test).[jt]s?(x)"],
  };