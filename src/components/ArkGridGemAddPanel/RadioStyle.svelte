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

  // 젬이 가능한 의지력을 벗어난 경우
  $effect(() => {
    if (gemInput.willPower < ArkGridGemSpecs[gemInput.name].req - 5) {
      gemInput.willPower = ArkGridGemSpecs[gemInput.name].req - 5;
    }
    if (gemInput.willPower > ArkGridGemSpecs[gemInput.name].req - 1) {
      gemInput.willPower = ArkGridGemSpecs[gemInput.name].req - 1;
    }
  });
</script>

<div class="root">
  <!-- 젬 종류 -->
  <fieldset class="grid large">
    {#each availableGemSpecs as spec}
      <label class="radio-card">
        <input type="radio" bind:group={gemInput.name} value={spec.key} />
        <div class="card">
          <img src={getGemImage(gemAttr, spec.key)} alt={gemInput.name} />
          <span>{spec.spec.name[locale].split(' ').at(-1)}</span>
        </div>
      </label>
    {/each}
  </fieldset>

  <!-- 의지력 -->
  <fieldset class="grid small">
    <div class="card">
      <img src={imgWillPower} alt="포인트" />
    </div>
    {#each [3, 4, 5, 6, 7, 8, 9] as willPower}
      <label class="radio-card">
        <input
          bind:group={gemInput.willPower}
          type="radio"
          value={willPower}
          disabled={willPower < gemSpec.req - 5 || willPower > gemSpec.req - 1}
        />
        <div class="card">{willPower}</div>
      </label>
    {/each}
  </fieldset>

  <!-- 포인트 -->
  <fieldset class="grid small">
    <div class="card">
      <img src={imgCorePoint} alt="포인트" />
    </div>
    {#each [1, 2, 3, 4, 5] as corePoint}
      <label class="radio-card">
        <input bind:group={gemInput.corePoint} type="radio" value={corePoint} />
        <div class="card">{corePoint}</div>
      </label>
    {/each}
  </fieldset>

  <!-- 부옵션 -->
  {#each [gemInput.optionA, gemInput.optionB] as gemOption}
    <fieldset class="grid large">
      {#each Object.values(ArkGridGemOptionNames) as optionName}
        <label class="radio-card">
          <input
            bind:group={gemOption.optionType}
            type="radio"
            value={optionName}
            disabled={!availableGemOptionTypes.some((v) => v === optionName)}
          />
          <div class="card">
            {ArkGridGemOptionTypes[optionName].name[locale]}
          </div>
        </label>
      {/each}
    </fieldset>
    <fieldset class="grid small">
      <div class="card label">Lv.</div>
      {#each [1, 2, 3, 4, 5] as optionPoint}
        <label class="radio-card">
          <input bind:group={gemOption.value} type="radio" value={optionPoint} />
          <div class="card">{optionPoint}</div>
        </label>
      {/each}
    </fieldset>
  {/each}
</div>

<style>
  .root {
    width: 40rem;
    user-select: none;
  }
  /* radio button 가리기 */
  .radio-card input {
    display: none;
  }

  .radio-card .card {
    padding: 8px;
    cursor: pointer;
    white-space: nowrap;
    border: 1px var(--border) solid;
  }

  /* 선택된 상태 */
  .radio-card input:checked + .card {
    border-color: var(--primary);
    background-color: var(--title-shadow);
    font-weight: bold;
  }

  fieldset.grid {
    display: grid;
    gap: 8px;
    border: none;
    /* border: 1px var(--border) solid; */
  }

  /* 숫자용 (촘촘) */
  fieldset.grid.small {
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  }
  fieldset.grid.small .card {
    display: flex;
    align-items: center; /* 👈 세로 중앙 */
    justify-content: center; /* 👈 가로 중앙 */
    text-align: center;
  }

  /* 문자열용 (넓게) */
  fieldset.grid.large {
    grid-template-columns: repeat(3, 1fr);
  }
  .grid.large .card {
    display: flex;
    flex-direction: column; /* 👈 이미지 아래로 텍스트 */
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .radio-card input:disabled + .card {
    opacity: 0.5;
    cursor: auto;
    background-color: var(--muted);
  }
  /* Lv. 전용 */
  .card.label {
    font-weight: bold;
    background: transparent;
    border: none;
  }
</style>
