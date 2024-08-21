import dotenv from "dotenv";
dotenv.config();
//winner data
const apiKeysString = process.env.API_KEYS;
const apiKeys = JSON.parse(apiKeysString);


function filterWinnerTins(data, winner) {
  console.log(data);
  return data.filter(
    (entry) => entry.winner_tin.startsWith("0") && entry.winner === winner
  );
}

export const findWinnerTin = async (winner, limit = 20) => {
  for (let i = 0; i < apiKeys.length; i++) {
    const url = `https://opend.data.go.th/govspending/egpwinner?api-key=${
      apiKeys[i]
    }&winner=${winner}&limit=${limit || 20}&offset=0`;

    // console.log(i, url);

    const options = {
      method: "GET",
    };
    const response = await fetch(url, options);
    const res = await response.json(); // Convert response body to JSON
    const winnerTins = filterWinnerTins(res.result, winner);
    if (res?.message !== "API rate limit exceeded") return winnerTins;
  }
};
