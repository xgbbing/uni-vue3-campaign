<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { initScene } from '@/bootstrap/initScene'
import { ensureLogin } from '@/utils/auth'

onLaunch(async () => {
  console.log('App Launch')
  initScene()
  await ensureLogin()
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>
<style lang="scss">
/*每个页面公共css */
@import 'uview-plus/index.scss';
</style>
