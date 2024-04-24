import React from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom";

const TaskDetails = () => {
  const { id } = useParams();

  return <div>{id}</div>;
};

export default TaskDetails;
