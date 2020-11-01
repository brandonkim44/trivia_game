export const fetchTriviaQuestions = () => {
    return fetch("/src/data/triviaData.json")
        .then(res => {
            if (!res.ok) {
                throw new Error("HTTP Error " + res.status);
            }
            return res.json()
        })
        .then(data => data)
        .catch( function() {
            this.dataError = true;
        }
        );
};