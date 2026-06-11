<script>
  import { appLocale } from '../../lib/state/locale.state.svelte';
</script>

<div class="content">
  <h2>Credits</h2>
  {#if appLocale.current == 'ko_kr'}
    <p>
      게임 관련 이미지 및 명칭의 저작권은 스마일게이트에 있습니다. 계산 로직 및 사이트 소스 코드는
      개발자의 저작물이며, 비상업적 팬사이트로 운영됩니다. 권리자가 요청할 경우 해당 콘텐츠는 즉시
      삭제됩니다.
    </p>
    <p>This site uses the Lost Ark Open API (developer-lostark.game.onstove.com).</p>
    <p>
      Icons by
      <a href="https://fontawesome.com" target="_blank" rel="noopener noreferrer"> Font Awesome </a>
    </p>
    <p>Thanks to 루페온 퐁듀 길드, 아브렐슈드 청염각, 피드백을 주신 모든 분들</p>
  {/if}
  {#if appLocale.current == 'en_us'}
    <p>
      Copyrights for game-related images and names belong to SmileGate. The calculation logic and
      site source code are the developer's own work and this site operates as a non-commercial fan
      site. Content will be immediately removed if requested by the rights holder.
    </p>
    <p>This site uses the Lost Ark Open API (developer-lostark.game.onstove.com).</p>
    <p>
      Icons by
      <a href="https://fontawesome.com" target="_blank" rel="noopener noreferrer">Font Awesome</a>
    </p>
  {/if}
</div>
