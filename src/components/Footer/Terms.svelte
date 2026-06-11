<script>
  import { appLocale } from '../../lib/state/locale.state.svelte';
</script>

<div class="content">
  <h2>Terms of Service</h2>
  {#if appLocale.current == 'ko_kr'}
    <p>본 서비스는 게임 운영사 또는 공식 API 제공자의 공식 서비스가 아닙니다.</p>
    <p>
      본 서비스는 사용자가 입력하거나 화면 인식으로 제공한 아크 그리드 정보를 브라우저 내에서
      분석하여 최적화 결과를 표시하는 도구입니다. 본 사이트를 이용 시 약관과 정책에 동의하는 것으로
      간주됩니다.
    </p>
    <p>서비스에서 제공하는 분석 결과 및 평가는 정확성, 완전성, 최신성을 보장하지 않습니다.</p>
    <p>
      본 서비스를 이용함으로써 발생하는 어떠한 손실, 불이익, 게임 내 결과에 대해서도 개발자는 책임을
      지지 않습니다.
    </p>
    <p>본 서비스는 사전 공지 없이 변경되거나 중단될 수 있습니다.</p>
    <p>
      본 서비스는 사이트 사용 패턴 및 버튼 클릭과 같은 이벤트를 통계 목적으로 수집할 수 있습니다.
    </p>
  {/if}
  {#if appLocale.current == 'en_us'}
    <p>
      This service is not an official service of the game operator or the official API provider.
    </p>
    <p>
      This service is a tool that analyzes Ark Grid information provided by users either through
      input or screen recognition in the browser and displays optimized results. By using this site,
      you agree to its terms and policies.
    </p>
    <p>
      The analysis results and evaluations provided by the service do not guarantee accuracy,
      completeness, or timeliness.
    </p>
    <p>
      The developer is not responsible for any loss, disadvantage, or in-game outcome resulting from
      the use of this service.
    </p>
    <p>This service may be changed or discontinued without prior notice.</p>
    <p>
      This service may collect site usage patterns and events such as button clicks for statistical
      purposes.
    </p>
  {/if}
</div>
