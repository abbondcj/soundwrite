const openAiApi = {
    SentimentAnalysis: async (prompt, auth, userId) => {
        const res = await fetch(`/sentiment`, {
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
        const res = await fetch(`/spellcheck`, {
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
        const res = await fetch(`/professionalize`, {
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