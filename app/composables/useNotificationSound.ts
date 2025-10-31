export const useNotificationSound = () => {
  let audio: HTMLAudioElement | null = null
  let stopTimeout: NodeJS.Timeout | null = null
  let isPlaying = false

  const playNotification = () => {
    if (isPlaying) return
    if (typeof window === 'undefined') return

    isPlaying = true
    console.log('🔔 Tocando notificação...')

    try {
      // Criar elemento de áudio
      audio = new Audio('/sounds/notification.mp3')
      audio.loop = true // Repetir o som
      audio.volume = 0.7 // Volume 70%

      // Tocar o som
      audio.play().catch(err => {
        console.error('❌ Erro ao tocar notificação:', err)
        isPlaying = false
      })

      // Parar automaticamente após 30 segundos
      stopTimeout = setTimeout(() => {
        stopNotification()
      }, 30000)
    } catch (err) {
      console.error('❌ Erro ao criar áudio:', err)
      isPlaying = false
    }
  }

  const stopNotification = () => {
    if (!isPlaying) return

    console.log('🔕 Parando notificação...')
    
    if (stopTimeout) {
      clearTimeout(stopTimeout)
      stopTimeout = null
    }

    if (audio) {
      audio.pause()
      audio.currentTime = 0
      audio = null
    }

    isPlaying = false
  }

  return {
    playNotification,
    stopNotification
  }
}
