import "@testing-library/jest-dom/matchers";
import { TextEncoder, TextDecoder } from "util";
import { jest } from "@jest/globals";

global.jest = jest;

global.TextEncoder = TextEncoder;
// global.TextDecoder = TextDecoder;
import React, { ReactNode } from "react";

interface MyComponentProps {
  children: ReactNode;
}

const MyComponent = ({ children }: MyComponentProps) => {
  return <div>{children}</div>;
};
