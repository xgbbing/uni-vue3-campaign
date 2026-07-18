class AudioManager {
  private bg: HTMLAudioElement | null = null;
  private effects: HTMLAudioElement[] = [];
  // /**
  //  * 微信解锁
  //  */
  // unlock() {
  //   const audio = new Audio();
  //   audio.src = "/static/silent.mp3";
  //   audio
  //     .play()
  //     .then(() => {
  //       audio.pause();
  //     })

  //     .catch(() => {});
  // }

  /**
   * 播放背景音乐
   */
  playBGM(url: string) {
    if (this.bg) {
      this.bg.pause();
    }
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0;
    audio.play();
    // 淡入
    let v = 0;
    const timer = setInterval(() => {
      v += 0.05;
      audio.volume = v;
      if (v >= 1) {
        clearInterval(timer);
      }
    }, 100);
    this.bg = audio;
  }

  /**
   * 音效
   */
  playEffect(url: string) {
    const audio = new Audio(url);
    audio.volume = 1;
    audio.play();
    this.effects.push(audio);
  }

  pause() {
    this.bg?.pause();
  }

  resume() {
    this.bg?.play();
  }
}

export const audioManager = new AudioManager();
