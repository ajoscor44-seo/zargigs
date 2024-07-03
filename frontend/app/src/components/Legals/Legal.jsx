import React from "react";

const Legal = ({ data }) => {
  return (
    <div className="p-2">
      <div className="flex flex-col gap-2">
        {data.map((item, i) => {
          return (
            <div key={i}>
              {item.useList ? (
                <div>
                  <h2 className="font-semibold italic text-green-500">
                    {item.title}
                  </h2>
                  <ul className=" list-disc">
                    {item.list.map((lItem) => (
                      <li className="text-sm block">{lItem}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <h2 className="font-semibold italic text-green-500">
                    {item.title}
                  </h2>
                  <p className="text-sm">
                    {item.description}{" "}
                    {item.useLink && (
                      <a
                        className="text-green-500 hover:underline"
                        href={item.href}
                        target="_blank"
                      >
                        {item.linkText}
                      </a>
                    )}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Legal;
