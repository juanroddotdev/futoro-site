<template>
  <defs>
    <filter x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" id="roughPaper">
      <feTurbulence type="fractalNoise" baseFrequency="128" numOctaves="1" result="noise" />
      <feDiffuseLighting in="noise" lighting-color="white" surfaceScale="1" result="diffLight">
        <feDistantLight azimuth="45" elevation="55" />
      </feDiffuseLighting>
      <feGaussianBlur in="diffLight" stdDeviation="0.75" result="dlblur" />
      <feComposite operator="arithmetic" k1="1.2" k2="0" k3="0" k4="0" in="dlblur" in2="SourceGraphic" result="out" />
    </filter>

    <filter x="-2%" y="-2%" width="104%" height="104%" filterUnits="objectBoundingBox" id="PencilTexture">
      <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="3" result="noise" />
      <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="3" in="SourceGraphic" result="newSource" />
    </filter>

    <filter x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" id="pencilTexture2">
      <feTurbulence type="fractalNoise" baseFrequency="2" numOctaves="5" stitchTiles="stitch" result="f1" />
      <feColorMatrix type="matrix" values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -1.5 1.5" result="f2" />
      <feComposite operator="in" in2="f2" in="SourceGraphic" result="f3" />
    </filter>

    <filter x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" id="pencilTexture3">
      <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="5" stitchTiles="stitch" result="f1" />
      <feColorMatrix type="matrix" values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -1.5 1.5" result="f2" />
      <feComposite operator="in" in2="f2b" in="SourceGraphic" result="f3" />
      <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="3" result="noise" />
      <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="2.5" in="f3" result="f4" />
    </filter>

    <filter x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" id="pencilTexture4">
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="1" result="f1" />
      <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="5" in="SourceGraphic" in2="f1" result="f4" />
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="10" result="f2" />
      <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="5" in="SourceGraphic" in2="f2" result="f5" />
      <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="100" result="f3" />
      <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="3" in="SourceGraphic" in2="f3" result="f6" />
      <feBlend mode="multiply" in2="f4" in="f5" result="out1" />
      <feBlend mode="multiply" in="out1" in2="f6" result="out2" />
    </filter>
    <filter x="-2%" y="-2%" width="104%" height="104%" filterUnits="objectBoundingBox" id="pencilTexture5">
      <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="3" result="noise">
      </feTurbulence>
      <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="3" in="SourceGraphic" result="newSource">
      </feDisplacementMap>
    </filter>
  </defs>
</template> 