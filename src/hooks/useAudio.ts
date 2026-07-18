
interface AudioOptions {
	bgMusic : string;
}

export function useAudio(options : AudioOptions) {
	const {
		bgMusic,
	} = options

	let audioContext : any;
	// #ifdef MP-WEIXIN
	audioContext = uni.createInnerAudioContext();
	// #endif
	// #ifdef H5
	audioContext = new Audio();
	// #endif
	// 可以设置音频源、循环等
	audioContext.src = bgMusic;

	function playMusic() {
		const res = audioContext.play();
		if (res instanceof Promise) {
			res.catch(err => {
				console.log("自动播放失败:", err);
			});
		}
	}
	function pauseMusic() {
		audioContext.pause()
	}

	return {
		playMusic,
		pauseMusic,
	}
}