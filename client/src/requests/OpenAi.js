const openAiApi = {
    SentimentAnalysis: async (prompt, auth, userId) => {
        const res = await fetch(`54.83.227.27:9000/sentiment`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': auth,
                'userid': userId,
            },
            method: 'POST',
            body: JSON.stringify({prompt}),
        });

        return res;
    },
    Spellcheck: async (prompt, auth, userId) => {
        const res = await fetch(`54.83.227.27:9000/spellcheck`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': auth,
                'userid': userId,
            },
            method: 'POST',
            body: JSON.stringify({prompt}),
        });

        return res;
    },
    Professionalize: async (prompt, auth, userId) => {
        const res = await fetch(`54.83.227.27:9000/professionalize`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': auth,
                'userid': userId,
            },
            method: 'POST',
            body: JSON.stringify({prompt}),
        });

        return res;
    },
};

export default openAiApi;