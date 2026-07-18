import request from '@/api/request'

export default {
	get(url, data) {
		return request('GET', url, data)
	},

	post(url, data) {
		return request('POST', url, data)
	},
}