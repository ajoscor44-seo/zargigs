import React, { useEffect, useState } from "react";

const DownloadPermissionChecker = () => {
  const [allowDownloads, setAllowDownloads] = useState(false);

  useEffect(() => {
    const isAllowDownloadsEnabled = () => {
      const frame = document.createElement("iframe");
      frame.src = "data:text/html;charset=utf-8,";
      frame.sandbox.add("allow-downloads");
      return frame.sandbox.supports("allow-downloads");
    };

    const checkPermissions = async () => {
      const permissionGranted = await isAllowDownloadsEnabled();
      setAllowDownloads(permissionGranted);
    };

    checkPermissions();
  }, []);

  return (
    <div>
      {allowDownloads ? null : (
        <p>
          Downloads are currently disallowed. Please{" "}
          <a
            href="chrome://flags/#allow-downloads"
            target="_blank"
            rel="noopener noreferrer"
          >
            enable the allow-downloads flag
          </a>{" "}
          in Chrome settings.
        </p>
      )}
    </div>
  );
};

export default DownloadPermissionChecker;
