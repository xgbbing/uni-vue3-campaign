import api from '@/api/api'

export function loginByCode(params) {
	return new Promise((resolve) => {
		api.post("/api/login", params).then(res => {
			resolve(res.data)
		})
	})
}