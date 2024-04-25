const CopyToClipboard = (messageRef) => {
  const textInput = messageRef.current;
  textInput.select();
  const value = document.execCommand("copy").valueOf();

  return value;
};

export default CopyToClipboard;
