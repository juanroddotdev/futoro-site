<script lang="ts" setup>

</script>

<template>
  <div class="logo-page">
    <h1>Futoro Logo – Gradient Variants</h1>

  <div class="logo-container">
    <h2>🌈 Original Gradient (Purple → Pink)</h2>
    <svg viewBox="0 0 600 200">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#a18cd1; stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fbc2eb; stop-opacity:1" />
        </linearGradient>
      </defs>
      <path class="sketch" d="M50 140 Q55 100, 80 110 T110 140 Q130 170, 160 130 Q170 120, 210 140 Q220 150, 250 130 Q270 100, 310 140 Q340 180, 400 130" />
      <text x="30" y="140" class="final" fill="url(#grad1)">Futoro</text>
    </svg>

    <h2>🍃 Cool Mint Gradient (Green → Aqua)</h2>
    <svg viewBox="0 0 600 200">
      <defs>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#42e695; stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3bb2b8; stop-opacity:1" />
        </linearGradient>
      </defs>
      <path class="sketch" d="M50 140 Q55 100, 80 110 T110 140 Q130 170, 160 130 Q170 120, 210 140 Q220 150, 250 130 Q270 100, 310 140 Q340 180, 400 130" />
      <text x="30" y="140" class="final" fill="url(#grad2)">Futoro</text>
    </svg>

    <h2>🌇 Sunset Blend (Orange → Red)</h2>
    <svg viewBox="0 0 600 200">
      <defs>
        <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#ff9a8b; stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ff6a88; stop-opacity:1" />
        </linearGradient>
      </defs>
      <path class="sketch" d="M50 140 Q55 100, 80 110 T110 140 Q130 170, 160 130 Q170 120, 210 140 Q220 150, 250 130 Q270 100, 310 140 Q340 180, 400 130" />
      <text x="30" y="140" class="final" fill="url(#grad3)">Futoro</text>
    </svg>

    <h2>🔮 Electric Violet (Blue → Neon Purple)</h2>
    <svg viewBox="0 0 600 200">
      <defs>
        <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#00c6ff; stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7b2ff7; stop-opacity:1" />
        </linearGradient>
      </defs>
      <path class="sketch" d="M50 140 Q55 100, 80 110 T110 140 Q130 170, 160 130 Q170 120, 210 140 Q220 150, 250 130 Q270 100, 310 140 Q340 180, 400 130" />
      <text x="30" y="140" class="final" fill="url(#grad4)">Futoro</text>
    </svg>
  </div>
  </div>
</template>

<style lang="scss" scoped>
 .logo-page {
      font-family: 'Poppins', sans-serif;
      background: #f7f7f9;
      margin: 0;
      padding: 2rem;
      text-align: center;
      color: #333;
    }
    h1 {
      margin-bottom: 1rem;
    }
    h2 {
      margin-top: 3rem;
    }
    .logo-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 2rem;
    }
    svg {
      z-index: 100;
      width: 80%;
      max-width: 600px;
      margin-bottom: 3rem;

    }

    @keyframes draw {
      to {
        stroke-dashoffset: 0;
      }
    }

    @keyframes fillIn {
      0% {
        fill-opacity: 0;
      }
      100% {
        fill-opacity: 1;
      }
    }

    .sketch {
      fill: none;
      stroke: #999;
      stroke-width: 1.5;
      stroke-dasharray: 300;
      stroke-dashoffset: 300;
      animation: draw 2s ease forwards;
      opacity: 0.5;
    }

    .final {
      font-family: 'Poppins', sans-serif;
      font-size: 72px;
      font-weight: 600;
      fill-opacity: 0;
      animation: fillIn 2s ease forwards;
      animation-delay: 2s;
    }
  
</style>
