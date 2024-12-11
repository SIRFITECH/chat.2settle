// import "@testing-library/jest-dom/matchers";
// import { TextEncoder, TextDecoder } from "util";
// import "@testing-library/jest-dom";

// import { jest } from "@jest/globals";
// import React, { ReactNode } from "react";

// global.jest = jest;

// global.TextEncoder = TextEncoder;
// // global.TextDecoder = TextDecoder;

// interface MyComponentProps {
//   children: ReactNode;
// }

// const MyComponent = ({ children }: MyComponentProps) => {
//   return <div>{children}</div>;
// };

import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Extend the global object with Jest types
declare global {
  var TextEncoder: typeof TextEncoder;
  var TextDecoder: typeof TextDecoder;
}

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;

// If you need to use jest.fn() or other Jest globals, you can import them like this:
// import { jest } from "@jest/globals";
global.jest = jest;
