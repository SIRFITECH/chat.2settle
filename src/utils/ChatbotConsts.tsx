import { ConnectButton } from "@rainbow-me/rainbowkit";

export const initialMessages = [
  {
    type: "incoming",
    content: (
      <span>
        How far👋
        <br />
        <br />
        Welcome to 2SettleHQ!, my name is Wálé, I am 2settle virtual assistance,{" "}
        <br />
        How may I help you?
        <br />
        Say "Hi" let us start
      </span>
    ),
    timestamp: new Date(),
    isComponent: false,
  },
];

export const componentMap: { [key: string]: React.ComponentType<any> } = {
  ConnectButton: ConnectButton,
  // Add other components here as needed
};

export const greetings = ["hi", "hello", "hey", "howdy"];
