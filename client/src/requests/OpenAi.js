const openAiApi = {
    SentimentAnalysis: async (prompt, auth, userId) => {
        const res = await fetch(`/api/sentiment`, {
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
        const res = await fetch(`/api/spellcheck`, {
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
        const res = await fetch(`/api/professionalize`, {
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