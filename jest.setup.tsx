import "@testing-library/jest-dom/matchers";
import { TextEncoder, TextDecoder } from "util";
// import { jest } from "@jest/globals";
import React, { ReactNode } from "react";

global.jest = jest;

global.TextEncoder = TextEncoder;
// global.TextDecoder = TextDecoder;

interface MyComponentProps {
  children: ReactNode;
}

const MyComponent = ({ children }: MyComponentProps) => {
  return <div>{children}</div>;
};
