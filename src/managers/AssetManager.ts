export enum AssetPriority {
	CRITICAL = 0,
	HIGH = 1,
	NORMAL = 2,
	LOW = 3,
}

export type AssetType = "image" | "video";

export interface AssetItem {
	id : string;
	url : string;
	type : AssetType;
	priority ?: AssetPriority;
}

class AssetManager {
	private cache = new Map<string, any>();
	private queue : AssetItem[] = [];
	private running = 0;
	private concurrency = 4;

	/**
	 * 是否已经缓存
	 */
	has(url : string) {
		return this.cache.has(url);
	}

	/**
	 * 获取缓存
	 */
	get(url : string) {
		return this.cache.get(url);
	}

	/**
	 * 加载资源
	 */
	async load(asset : AssetItem) {
		if (this.cache.has(asset.url)) {
			return this.cache.get(asset.url);
		}
		switch (asset.type) {
			case "image":
				return this.loadImage(asset);
			case "video":
				return this.loadVideo(asset);
		}
	}

	private loadImage(asset : AssetItem) {
		return new Promise((resolve) => {
			const img = new Image();
			img.fetchPriority = asset.priority === 0 ? "high" : "low";
			img.onload = () => {
				this.cache.set(asset.url, img);
				resolve(img);
			};
			console.log(asset.url, '====asset.url')
			img.src = asset.url;
		});
	}

	private loadVideo(asset : AssetItem) {
		return new Promise((resolve) => {
			const video = document.createElement("video");
			video.preload = "metadata";
			video.onloadedmetadata = () => {
				this.cache.set(asset.url, video);
				resolve(video);
			};
			video.src = asset.url;
			video.load();
		});
	}

	/**
	 * 批量加载
	 */
	async loadBlocking(assets : AssetItem[]) {
		const list = [...assets].sort(
			(a, b) => (a.priority ?? 2) - (b.priority ?? 2),
		);
		return Promise.all(list.map((item) => this.load(item)));
	}

	/**
	 * idle加载
	 */
	idleLoad(assets : AssetItem[]) {
		let index = 0;
		const run = (deadline : IdleDeadline) => {
			while (deadline.timeRemaining() > 5 && index < assets.length) {
				this.load(assets[index++]);
			}
			if (index < assets.length) {
				requestIdleCallback(run);
			}
		};
		requestIdleCallback(run);
	}
}

export const assetManager = new AssetManager();