<script lang="ts">
  import imgCorePoint from '../../assets/corepoint.png';
  import imgWillPower from '../../assets/willpower.png';
  import type { AppLocale, ArkGridAttr } from '../../lib/constants/enums';
  import {
    type ArkGridGemName,
    ArkGridGemOptionNames,
    ArkGridGemOptionTypes,
    ArkGridGemSpecs,
    getGemImage,
  } from '../../lib/models/arkGridGems';
  import type { GemInput } from './Wrapper.svelte';

  type Props = {
    gemAttr: ArkGridAttr;
    gemInput: GemInput;
    locale: AppLocale;
  };
  let { gemAttr, gemInput = $bindable(), locale }: Props = $props();

  function enforceSingleDigit(v: number, minimum: number, maximum: number) {
    // 이미 값이 있던 경우 값을 추가로 입력하면 10이상이 된다. 그때 마지막 자리만 사용한다.
    if (v > 10) {
      v = v % 10;
    }
    return Math.min(maximum, Math.max(minimum, v));
  }

  // 현재 gemAttr에서 가능한 gemSpec들을 가져옴
  let availableGemSpecs = $derived(
    Object.entries(ArkGridGemSpecs)
      .filter(([, spec]) => spec.attr === gemAttr)
      .map(([key, spec]) => ({
        key: key as ArkGridGemName,
        spec,
      }))
  );
  $effect(() => {
    // 현재 이름이 가능한 이름이 아니라면, 0번째로 리셋 (안정, 침식)
    if (!availableGemSpecs.some((v) => v.key === gemInput.name)) {
      gemInput.name = availableGemSpecs[0]?.key;
    }
  });

  // 2. 현재 gemSepc에서 가능한 옵션 가져옴
  let gemSpec = $derived(ArkGridGemSpecs[gemInput.name]);
  let availableGemOptionTypes = $derived(gemSpec.availableOptions);

  $effect(() => {
    // 현재 가능한 옵션이 아니라면, 가능한 옵션으로 초기화
    // 초기화 시킬 땐 반대 옵션과 같다면 최소한 같지 않도록 함
    if (!availableGemOptionTypes.some((v) => v === gemInput.optionA.optionType)) {
      gemInput.optionA.optionType =
        gemInput.optionB.optionType === availableGemOptionTypes[0]
          ? availableGemOptionTypes[1]
          : availableGemOptionTypes[0];
      gemInput.optionA.value = 1;
    }
    if (!availableGemOptionTypes.some((v) => v === gemInput.optionB.optionType)) {
      // B의 경우 A와 겹치지 않는 옵션으로 초기화
      gemInput.optionB.optionType =
        gemInput.optionA.optionType === availableGemOptionTypes[0]
          ? availableGemOptionTypes[1]
          : availableGemOptionTypes[0];
      gemInput.optionB.value = 1;
    }
  });

  // 젬이 가능한 의지력을 벗어난 경우 리셋
  $effect(() => {
    if (gemInput.willPower < ArkGridGemSpecs[gemInput.name].req - 5) {
      gemInput.willPower = ArkGridGemSpecs[gemInput.name].req - 5;
    }
    if (gemInput.willPower > ArkGridGemSpecs[gemInput.name].req - 1) {
      gemInput.willPower = ArkGridGemSpecs[gemInput.name].req - 1;
    }
  });
</script>

<div class="content">
  <div class="col">
    <div class="image-wrapper">
      <img src={getGemImage(gemAttr, gemInput.name)} alt={gemInput.name} />
    </div>
    <label>
      <select bind:value={gemInput.name}>
        {#each availableGemSpecs as spec}
          <option value={spec.key}>{spec.spec.name[locale].split(' ').at(-1)}</option>
        {/each}
      </select>
    </label>
  </div>
  <div class="col">
    <div class="row">
      <label>
        <!-- svelte 5 function binding -->
        <input
          bind:value={
            () => gemInput.willPower,
            (v) => (gemInput.willPower = enforceSingleDigit(v, gemSpec.req - 5, gemSpec.req - 1))
          }
          type="number"
          min={gemSpec.req - 5}
          max={gemSpec.req - 1}
        />
      </label>
      <div class="image-wrapper">
        <img src={imgWillPower} alt="의지력" />
      </div>
    </div>
    <div class="row">
      <label>
        <input
          bind:value={
            () => gemInput.corePoint, (v) => (gemInput.corePoint = enforceSingleDigit(v, 1, 5))
          }
          type="number"
          min="1"
          max="5"
        />
      </label>
      <div class="image-wrapper">
        <img src={imgCorePoint} alt="포인트" />
      </div>
    </div>
  </div>
  <div class="col">
    {#each [gemInput.optionA, gemInput.optionB] as gemOption}
      <div class="row">
        <label>
          <select bind:value={gemOption.optionType}>
            {#each Object.values(ArkGridGemOptionNames) as option}
              <option value={option} disabled={!availableGemOptionTypes.some((v) => v === option)}
                >{ArkGridGemOptionTypes[option].name[locale]}</option
              >
            {/each}
          </select>
        </label>
        <label>
          Lv.
          <input
            bind:value={
              () => gemOption.value, (v) => (gemOption.value = enforceSingleDigit(v, 1, 5))
            }
            type="number"
            min="1"
            max="5"
          />
        </label>
      </div>
    {/each}
  </div>
</div>

<style>
  .content {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
  .col {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
  }
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 1rem;
  }
  .image-wrapper {
    display: flex;
    align-items: center; /* 세로 중앙 */
    justify-content: center; /* 가로 중앙 (선택) */
  }
  .image-wrapper img {
    margin: auto;
  }

  input,
  option,
  select {
    font-size: 1rem;
    width: 8.5rem;
  }

  input[type='number'] {
    width: 2rem;
  }
</style>
