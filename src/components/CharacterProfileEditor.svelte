<script lang="ts">
  import type { CharacterProfile } from '../lib/state/profile.state.svelte';
  import ArkGridAllGemListPanel from './ArkGridAllGemListPanel.svelte';
  import ArkGridCoreEditPanel from './ArkGridCoreEditPanel.svelte';
  import SolvePanel from './SolvePanel.svelte';

  interface Props {
    profile: CharacterProfile | null;
  }
  let { profile = $bindable() }: Props = $props();
</script>

{#if profile}
  <div class="dual-panel">
    <div>
      <ArkGridCoreEditPanel {profile} />
    </div>
    <div>
      <ArkGridAllGemListPanel gems={profile.gems} />
    </div>
  </div>
  <SolvePanel bind:profile></SolvePanel>
{/if}
