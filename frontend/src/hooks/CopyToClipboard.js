import React from "react";

const CopyToClipboard = (messageRef) => {
  const textarea = messageRef.current;
  textarea.select();
  const value = document.execCommand("copy").valueOf();

  return value;
};

export default CopyToClipboard;
