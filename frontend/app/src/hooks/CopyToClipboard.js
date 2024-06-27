const CopyToClipboard = (messageRef) => {
  const textInput = messageRef.current;
  textInput.style.display = "block";
  textInput.select();
  textInput.setSelectionRange(0, 99999);
  const successful = document.execCommand("copy");
  textInput.style.display = "none";

  return successful;
};

export default CopyToClipboard;
