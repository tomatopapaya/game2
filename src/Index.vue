<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <audio ref="bgMusic" :src="`${base}詛咒的寺院音樂.mp3`" loop autoplay></audio>
    <div style="font-size: 30px; color: white; font-weight: bold;">Power by {{ $store.state.author }}</div>
    <img  @click="easyMode":src="`${base}easy.png`" alt="Image"  :style="{ width: '120px', height: auto, position: 'absolute', top: '300px', left: '5px' }">   
    <img  @click="hardMode":src="`${base}hard.png`" alt="Image"  :style="{ width: '135px', height: auto, position: 'absolute', top: '360px', left: '0px' }">   
    
    <br>
    <img v-show="isWin" :src="`${base}win.png`"  :style="{ width: '270px', height: '150px', position: 'fixed', top: '150px', left: '330px',zIndex: 9999 }">   
    <img :src="`${base}player${playerFrame}.png`"  :style="{ width: widthX  + 'px', height: '92px', position: 'absolute', top: playerY + 'px', left: playerX + 'px', transform: playerDirection === 'right' ? 'scaleX(-1)' : 'scaleX(1)' }">   
    <img v-show="!ishard":src="`${base}block.png`" :style="{ width: '100px', height: '60px', position: 'absolute', top: '400px', left: '180px' }">
    <img v-show="!ishard":src="`${base}block.png`" :style="{ width: '100px', height: '60px', position: 'absolute', top: '340px', left: '180px' }">
    <img v-show="!ishard":src="`${base}block.png`" :style="{ width: '100px', height: '60px', position: 'absolute', top: '300px', left: '300px' }">
    <img v-show="!ishard":src="`${base}block.png`" :style="{ width: '100px', height: '60px', position: 'absolute', top: '280px', left: '160px' }">
    <img v-show="!ishard":src="`${base}block.png`" :style="{ width: '100px', height: '60px', position: 'absolute', top: '220px', left: '250px' }">
    <img v-show="!ishard":src="`${base}block.png`" :style="{ width: '100px', height: '60px', position: 'absolute', top: '200px', left: '0px' }">
    <img v-show="!ishard":src="`${base}block.png`" :style="{ width: '100px', height: '60px', position: 'absolute', top: '140px', left: '10px' }">
    <img v-show="!ishard":src="`${base}block.png`" :style="{ width: '100px', height: '60px', position: 'absolute', top: '80px', left: '160px' }">
    <img v-show="!ishard":src="`${base}block.png`" :style="{ width: '100px', height: '60px', position: 'absolute', top: '80px', left: '400px' }">
    <img v-show="!ishard":src="`${base}block.png`" :style="{ width: '100px', height: '60px', position: 'absolute', top: '140px', left: '420px' }">
    <img v-show="!ishard":src="`${base}block.png`" :style="{ width: '100px', height: '60px', position: 'absolute', top: '350px', left: '770px' }">
    <img v-show="!ishard":src="`${base}block.png`" :style="{ width: '100px', height: '60px', position: 'absolute', top: '290px', left: '810px' }">
    <img v-show="!ishard":src="`${base}block.png`" :style="{ width: '100px', height: '60px', position: 'absolute', top: '230px', left: '745px' }">
    <img v-show="!ishard":src="`${base}block.png`" :style="{ width: '100px', height: '60px', position: 'absolute', top: '180px', left: '810px' }">
    <img :src="`${base}block.png`" :style="{ width: '100px', height: '60px', position: 'absolute', top: '120px', left: '700px' }">
    <img :src="`${base}award.png`" :style="{ width: '40px', height:'40px', position:'absolute', top:'80px', left:'730px' }">

</template>

<script lang="js">

import { defineComponent } from 'vue'

export default defineComponent({

    data() {
        return {
            base: import.meta.env.BASE_URL,
            isJumping: false,
            isWin: false,
            ishard: false,
            jumpVelocity: 0,
            jumpInterval: null,
            widthX: 60,
            playerX: 520, 
            playerY: 372, 
            playerSpeed: 20,
            playerFrame: '',
            walkInterval: null,
            isMoving: false,
            playerDirection: 'left',
            keysPressed: {},
            moveInterval: null,
            platforms: [
                { x: 180, y: 400, width: 100 },
                { x: 180, y: 340, width: 100 },
                { x: 300, y: 300, width: 100 },
                { x: 160, y: 280, width: 100 },
                { x: 250, y: 220, width: 100 },
                { x: 10, y: 140, width: 100 },
                { x: 160, y: 80, width: 100 },
                { x: 400, y: 80, width: 100 },  
                { x: 0, y: 200, width: 100 },
                { x: 760, y: 350, width: 100 },
                { x: 420, y: 140, width: 100 },
                { x: 810, y: 290, width: 100 },
                { x: 700, y: 120, width: 100 },
                { x: 745, y: 230, width: 100 },
                { x: 810, y: 180, width: 100 }
            ],
            onPlatform: false,
            award: { x: 730, y: 80, width: 40, height: 40 }
        }
    },

    mounted() {
        window.addEventListener('keydown', this.handleKeydown)
        window.addEventListener('keyup', this.handleKeyup)
        const playMusic = () => {
        this.$refs.bgMusic.play().catch(e => console.log(e))
        document.removeEventListener('click', playMusic)
        window.removeEventListener('keydown', playMusic)
        }
        document.addEventListener('click', playMusic)
        window.addEventListener('keydown', playMusic)
    },

    beforeUnmount() {
        window.removeEventListener('keydown', this.handleKeydown)    
        window.removeEventListener('keyup', this.handleKeyup) 
        this.stopMoving()
        clearInterval(this.jumpInterval)
    },

    watch: {
        playerY(newY) {
            this.$store.commit('updateHeight', newY + 92)
        },
        playerX(newX) {
            this.$store.commit('updateWidth', newX)
        }
    },


    methods: {

        handleKeydown(event) {
            if (event.key === 'ArrowLeft') {
                if (this.keysPressed[event.key]) return
                this.keysPressed[event.key] = true
                this.playerDirection = 'left'
                this.widthX = 75
                this.startWalkAnimation()
                this.startMoving()
            } else if (event.key === 'ArrowRight') {
                if (this.keysPressed[event.key]) return
                this.keysPressed[event.key] = true
                this.playerDirection = 'right'
                this.widthX = 75
                this.startWalkAnimation()
                this.startMoving()
            } else if (event.key === 'Alt' || event.key === ' ' || event.key === 'ArrowUp') {
                if (this.isJumping) return
                this.startJump()
            }
        },

        easyMode() {
            this.ishard = false
            this.isWin = false
        },

        hardMode() {
            this.ishard = true
            this.isWin = false
        },

        handleKeyup(event) {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                this.keysPressed[event.key] = false
                this.widthX = 60
                this.stopWalkAnimation()
                this.stopMoving()
            }   
        },

        startJump() {
            this.isJumping = true
            this.jumpVelocity = -12
            const groundY = 372

            this.jumpInterval = setInterval(() => {
                const nextY = this.playerY + this.jumpVelocity
                this.jumpVelocity += 1.2
                const playerBottom = nextY + 92
                const playerLeft = this.playerX
                const playerRight = this.playerX + this.widthX

                let landedOnPlatform = false
                if (this.jumpVelocity > 0) {
                    for (const p of this.platforms) {
                        const wasAbove = this.playerY + 92 <= p.y
                        const nowBelow = playerBottom >= p.y
                        const horizontalOverlap = playerRight > p.x && playerLeft < p.x + p.width

                        if (wasAbove && nowBelow && horizontalOverlap) {
                            this.playerY = p.y - 92
                            this.isJumping = false
                            this.onPlatform = true
                            clearInterval(this.jumpInterval)
                            this.jumpInterval = null
                            landedOnPlatform = true
                            break
                        }
                    }
                }

                if (!landedOnPlatform) {
                    if (nextY >= groundY) {
                        this.playerY = groundY
                        this.isJumping = false
                        this.onPlatform = false
                        clearInterval(this.jumpInterval)
                        this.jumpInterval = null
                    } else {
                        this.playerY = nextY
                        this.checkAwardCollision()
                    }
                }
            }, 30)
        },

        startWalkAnimation() {
            if (this.isMoving) return
            this.playerFrame = 1
            this.isMoving = true
            this.walkInterval = setInterval(() => {
                this.playerFrame = (this.playerFrame % 5) + 1
            }, 140)  
        },

        stopWalkAnimation() {
            clearInterval(this.walkInterval)
            this.walkInterval = null
            this.isMoving = false
            this.playerFrame = '' 
            this.widthX = 60
        },

        startMoving() {
            if (this.moveInterval) return
            this.moveInterval = setInterval(() => {
                if (this.playerDirection === 'left') {
                    this.playerX = Math.max(0, this.playerX - this.playerSpeed)
                } else {
                    this.playerX = Math.min(920 - this.widthX, this.playerX + this.playerSpeed)
                }
                this.checkAwardCollision()
                if (this.onPlatform && !this.isJumping) {
                    const playerCenter = this.playerX + this.widthX / 2
                    const onAnyPlatform = this.platforms.some(p => {
                        return playerCenter > p.x &&
                            playerCenter < p.x + p.width &&
                            this.playerY + 92 === p.y
                    })
                    if (!onAnyPlatform) {
                        this.onPlatform = false
                        this.startFall()
                    }
                }  
            }, 90)  
        },

        startFall() {
            this.isJumping = true
            this.jumpVelocity = 0
            const groundY = 372
            this.jumpInterval = setInterval(() => {
                this.jumpVelocity += 1.2
                const nextY = this.playerY + this.jumpVelocity
                const playerBottom = nextY + 92
                const playerLeft = this.playerX
                const playerRight = this.playerX + this.widthX

                let landedOnPlatform = false

                for (const p of this.platforms) {
                    const wasAbove = this.playerY + 92 <= p.y
                    const nowBelow = playerBottom >= p.y
                    const horizontalOverlap = playerRight > p.x && playerLeft < p.x + p.width

                    if (wasAbove && nowBelow && horizontalOverlap) {
                        this.playerY = p.y - 92
                        this.isJumping = false
                        this.onPlatform = true
                        clearInterval(this.jumpInterval)
                        this.jumpInterval = null
                        landedOnPlatform = true
                        break
                    }
                }

                if (!landedOnPlatform) {
                    if (nextY >= groundY) {
                        this.playerY = groundY
                        this.isJumping = false
                        this.onPlatform = false
                        clearInterval(this.jumpInterval)
                        this.jumpInterval = null
                    } else {
                        this.playerY = nextY
                        this.checkAwardCollision()  
                    }
                }
            }, 30)
        },

        stopMoving() {
            clearInterval(this.moveInterval)
            this.moveInterval = null
        },

        checkAwardCollision() {
            if (this.isWin) return
            const playerRight = this.playerX + this.widthX / 2
            const playerBottom = this.playerY + 92

            const hit =
                playerRight > this.award.x &&
                this.playerX < this.award.x + this.award.width / 2 &&
                playerBottom > this.award.y &&
                this.playerY < this.award.y + this.award.height / 2

            if (hit) {
                this.isWin = true
            }
        },
    }
})
</script>