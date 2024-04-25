const fetchStates = async () => {
  const states = await fetch(
    "https://nigeria-states-towns-lga.onrender.com/api/all"
  )
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((error) => console.error(error));

  return states;
};

export default fetchStates;
