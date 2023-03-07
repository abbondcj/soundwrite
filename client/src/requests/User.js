const userApi = {
	GetTokens: async (auth, userId) => {
		const res = await fetch('/user-tokens', {
			headers: {
				'authorization': auth,
				'userid': userId,
			},
			method: 'GET',
		})

		return res;
	},
	UpdateTheme: async (auth, userId, colorTheme) => {
		const res = await fetch('/user-theme', {
			headers: {
				'Content-Type': 'application/json',
				'authorization': auth,
				'userid': userId,
			},
			body: JSON.stringify({theme: colorTheme}),
			method: 'PUT',
		})

		return res;
	},
};

export default userApi;