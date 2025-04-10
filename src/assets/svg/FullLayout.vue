<template>
  <div class="site-wireframe">
    <div class="overlap-group-wrapper">
      <div class="overlap-group">
        <div class="type">Lorem ipsum</div>
        <p class="text-wrapper">
          Lorem ipsum dolor sit amet consectetur. Morbi donec elit dictum
          molestie posuere tincidunt. Lectus semper aliquam quis cursus id sed
          commodo.
        </p>
        <div class="div">
          Lorem un
          <br />
          ipsum
        </div>
        <div class="frame">
          <div class="type-2">Lorem ipsum dolor</div>
        </div>
        <div class="rectangle" />
        <div class="rectangle-2" />
        <div class="rectangle-3" />
        <div class="rectangle-4" />
        <div class="rectangle-5" />
        <div class="rectangle-6" />
        <div class="rectangle-7" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SiteWireframe",
});
</script>

<style>
.site-wireframe {
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
}

.site-wireframe .overlap-group-wrapper {
  background-color: #ffffff;
  height: auto;
  width: auto;
}

.site-wireframe .overlap-group {
  border-radius: 16px;
  height: auto;
  position: relative;
}

.site-wireframe .type {
  color: #000000;
  font-family: "Inter Tight-Medium", Helvetica;
  font-size: 31px;
  font-weight: 500;
  left: 105px;
  letter-spacing: 0;
  line-height: 37.2px;
  position: absolute;
  top: 274px;
  white-space: nowrap;
}

.site-wireframe .text-wrapper {
  color: #000000;
  font-family: "Inter Tight-Medium", Helvetica;
  font-size: 16px;
  font-weight: 500;
  left: 105px;
  letter-spacing: 0;
  line-height: 24px;
  position: absolute;
  top: 612px;
  width: 381px;
}

.site-wireframe .div {
  color: #000000;
  font-family: "Inter Tight-Medium", Helvetica;
  font-size: 95px;
  font-weight: 500;
  left: 105px;
  letter-spacing: 0;
  line-height: 114.0px;
  position: absolute;
  top: 332px;
}

.site-wireframe .frame {
  align-items: center;
  background-color: #d9d9d9;
  border: 4px solid;
  border-color: #000000;
  border-radius: 99px;
  display: inline-flex;
  gap: 10px;
  justify-content: center;
  left: 105px;
  padding: 16px 32px;
  position: absolute;
  top: 743px;
}

.site-wireframe .type-2 {
  color: transparent;
  font-family: "Inter Tight-Medium", Helvetica;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 19.2px;
  margin-top: -4.00px;
  position: relative;
  white-space: nowrap;
  width: fit-content;
}

.site-wireframe .rectangle {
  border: 4px solid;
  border-color: #000000;
  border-radius: 16px;
  height: 1024px;
  left: 0;
  position: absolute;
  top: 0;
  width: 1440px;
}

.site-wireframe .rectangle-2 {
  background-color: #d9d9d9;
  border: 4px solid;
  border-color: #000000;
  border-radius: 16px;
  height: 592px;
  left: 743px;
  position: absolute;
  top: 238px;
  width: 601px;
}

.site-wireframe .rectangle-3 {
  border: 4px solid;
  border-color: #000000;
  border-radius: 16px;
  height: 592px;
  left: 86px;
  position: absolute;
  top: 238px;
  width: 601px;
}

.site-wireframe .rectangle-4 {
  background-color: #d9d9d9;
  border: 4px solid;
  border-color: #000000;
  border-radius: 16px;
  height: 53px;
  left: 100px;
  position: absolute;
  top: 271px;
  width: 333px;
}

.site-wireframe .rectangle-5 {
  background-color: #d9d9d9;
  border: 4px solid;
  border-color: #000000;
  border-radius: 16px;
  height: 208px;
  left: 100px;
  position: absolute;
  top: 353px;
  width: 410px;
}

.site-wireframe .rectangle-6 {
  background-color: #d9d9d9;
  border: 4px solid;
  border-color: #000000;
  border-radius: 16px;
  height: 81px;
  left: 105px;
  position: absolute;
  top: 613px;
  width: 378px;
}

.site-wireframe .rectangle-7 {
  background-color: #d9d9d9;
  border: 4px solid;
  border-color: #000000;
  border-radius: 16px;
  height: 87px;
  left: 91px;
  position: absolute;
  top: 78px;
  width: 1257px;
}
</style>