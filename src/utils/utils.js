const proxyurl = "https://cors-anywhere.herokuapp.com/";

export const fetchTriviaQuestions = () => {
    return fetch(
      proxyurl + "https://github.com/brandonkim44/trivia_game/blob/main/src/data/triviaData.json?raw=true"
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("HTTP Error " + res.status);
        }
        return res.json();
      })
      .then((data) => data)
      .catch(function () {
        this.dataError = true;
      });
};