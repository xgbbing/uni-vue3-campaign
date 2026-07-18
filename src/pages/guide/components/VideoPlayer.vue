<template>
	<view v-if="props.show" class="popup-mask" @click.self="close">
		<view class="video-wrapper">
			<video class="video" :src="props.src" controls autoplay @ended="close" />
		</view>
		<view class="close-btn" @click="close">✕</view>
	</view>
</template>

<script setup>
	const props = defineProps({
		show: Boolean,
		src: String
	})

	const emit = defineEmits(['update:show'])

	function close() {
		emit('update:show', false)
	}
</script>

<style lang="scss" scoped>
	.popup-mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .85);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 100;
	}

	.video-wrapper {
		width: 100%;
		overflow: hidden;
	}

	.video {
		width: 100%;
		display: block;
	}

	.close-btn {
		position: fixed;
		top: 100rpx;
		right: 30rpx;
		width: 60rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		color: #fff;
		font-size: 36rpx;
		z-index: 101;
	}
</style>