import {
	ref
} from 'vue'

/**
 * 百分比区域（0~1）
 */
export interface PercentArea {
	x: number
	y: number
	width: number
	height: number
}

/**
 * 像素区域
 */
export interface PixelArea {
	left: number
	top: number
	right: number
	bottom: number
}

export type GestureArea = PercentArea | PixelArea

export interface GestureOptions {
	area: GestureArea
	direction?: 'left' | 'right' | 'up' | 'down'
	/**
	 * 最小滑动距离(px)
	 */
	distance?: number
	/**
	 * 垂直(水平)允许偏移(px)
	 */
	tolerance?: number
	/**
	 * 是否要求整个滑动过程都不能离开区域
	 */
	strictArea?: boolean
	onSuccess?: () => void
}

export function useGestureUnlock(options: GestureOptions) {
	const {
		direction = 'right',
		distance = 40,
		tolerance = 40,
		strictArea = true,
		onSuccess,
	} = options
	const unlocked = ref(false)
	const system = uni.getSystemInfoSync()
	/**
	 * 转换后的真实区域(px)
	 */
	const area = normalizeArea(options.area)
	let startX = 0
	let startY = 0
	let validStart = false
	let movedOut = false

	function normalizeArea(area: GestureArea): PixelArea {
		// 百分比模式
		if ('x' in area) {
			return {
				left: area.x * system.windowWidth,
				top: area.y * system.windowHeight,
				right: (area.x + area.width) * system.windowWidth,
				bottom: (area.y + area.height) * system.windowHeight,
			}
		}
		// 像素模式
		return area
	}

	function inArea(x: number, y: number) {
		return (
			x >= area.left &&
			x <= area.right &&
			y >= area.top &&
			y <= area.bottom
		)
	}

	function onTouchStart(e: any) {
		if (unlocked.value) return
		const touch = e.touches[0]
		startX = touch.clientX
		startY = touch.clientY
		validStart = inArea(startX, startY)
		movedOut = false
	}

	function onTouchMove(e: any) {
		if (!validStart) return
		if (!strictArea) return
		const touch = e.touches[0]
		if (!inArea(touch.clientX, touch.clientY)) {
			movedOut = true
		}
	}

	function onTouchEnd(e: any) {
		if (!validStart) return
		if (strictArea && movedOut) return
		const touch = e.changedTouches[0]
		const dx = touch.clientX - startX
		const dy = touch.clientY - startY
		let success = false
		switch (direction) {
			case 'right':
				success = dx >= distance && Math.abs(dy) <= tolerance
				break
			case 'left':
				success = dx <= -distance && Math.abs(dy) <= tolerance
				break
			case 'up':
				success = dy <= -distance && Math.abs(dx) <= tolerance
				break
			case 'down':
				success = dy >= distance && Math.abs(dx) <= tolerance
				break
		}
		if (!success) return
		unlocked.value = true
		onSuccess?.()
	}

	function reset() {
		unlocked.value = false
		validStart = false
		movedOut = false
	}

	return {
		unlocked,
		onTouchStart,
		onTouchMove,
		onTouchEnd,
		reset,
	}
}