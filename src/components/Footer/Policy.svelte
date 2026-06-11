<script>
  import { appLocale } from '../../lib/state/locale.state.svelte';
</script>

<div class="content">
  <h2>Privacy Policy</h2>

  {#if appLocale.current == 'ko_kr'}
    <p>
      본 사이트는 사용자가 제공한 이미지 및 데이터에 대해 서버로 전송하지않고, 사용자의 브라우저에만
      저장됩니다. 모든 분석은 사용자의 브라우저에서만 수행됩니다.
    </p>
    <p>
      업로드되거나 스캔된 게임 화면 이미지는 외부 서버로 전송되지 않으며, 페이지를 벗어나면 즉시
      폐기됩니다.
    </p>
    <p>본 서비스는 이름, 계정 정보, 이메일, IP 주소 등 개인정보를 수집하거나 저장하지 않습니다.</p>
    <p>
      본 사이트에서는 사용자의 활동을 GA4(Google Analytics 4)를 통해 익명으로 수집합니다. 수집되는
      정보는 사이트 사용 통계와 기능 개선을 위해서만 활용되며, 개인을 식별할 수 있는 정보는 포함되지
      않습니다.
    </p>
  {/if}
  {#if appLocale.current == 'en_us'}
    <p>
      This site does not transmit images or data provided by users to a server; they are stored only
      in the user's browser. All analysis is performed solely in the user's browser.
    </p>
    <p>
      Uploaded or scanned game screen images are not sent to external servers and are immediately
      discarded once you leave the page.
    </p>
    <p>
      This service does not collect or store personal information such as names, account
      information, email addresses, or IP addresses.
    </p>
    <p>
      This site anonymously collects user activity through GA4 (Google Analytics 4). The collected
      information is used only for site usage statistics and feature improvements, and does not
      include any personally identifiable information.
    </p>
  {/if}
</div>
