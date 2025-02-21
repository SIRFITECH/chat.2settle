import React from "react";
import SendIcon from "@mui/icons-material/Send";

interface Props {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement> | undefined;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleConversation: (chatInput: any) => Promise<void>;
  chatInput: string;
}

const ChatInput = ({
  textareaRef,
  chatInput,
  onChange,
  handleKeyPress,
  handleConversation,
}: Props) => {
  return (
    <div className="p-3 border-t border-gray-200 bg-white">
      <div className="flex items-center">
        <textarea
          ref={textareaRef}
          className="flex-grow pl-2 pr-2 py-2 border-none outline-none resize-none"
          placeholder="Enter a message..."
          rows={1}
          spellCheck={false}
          required
          value={chatInput}
          onChange={onChange}
          onKeyDown={handleKeyPress}
        />
        <button
          className="ml-2 text-blue-500 cursor-pointer"
          onClick={() => handleConversation(chatInput)}
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
