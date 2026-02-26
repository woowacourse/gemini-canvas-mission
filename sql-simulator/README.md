## 앱 이름: SQL 튜닝 시뮬레이터 (SQL Tuning Simulator)
## 카테고리: SQL 학습 앱

### 배포 링크
- https://gemini.google.com/share/26c63c2310ad

---

### 이 앱을 만든 이유
- SQL을 배우면서 문법은 알겠는데 실제로 어느정도 느리고 빨라지는지를 체감하기가 어려웠음
- DB 튜닝(인덱스, 캐시, 정렬 최적화 등)은 개념이 많고, 실제 환경이 없으면 실험하기가 힘듦
- 그래서 **쿼리 구조와 튜닝 레버를 조작하면 성능이 어떻게 변하는지**를 “시각적으로 비교”할 수 있는 학습용 시뮬레이터를 만들고자 했음
- 정답을 맞추는 도구가 아니라, **성능 변화의 방향성과 원인(병목)을 이해하는 학습 도구**를 목표

---

### 주요 기능
- **Query Builder (학습용 쿼리 생성기)**
  - 대상 테이블 선택(users / orders / order_items)
  - 조회 컬럼 수 조절(슬라이더)
  - JOIN 여부(없음 / orders / order_items)
  - WHERE 조건 개수(0~3)
  - ORDER BY 적용 여부
  - LIMIT 선택(없음 / 10 / 100 / 1000)
  - 위 설정에 따라 SQL 미리보기를 실시간 생성

- **성능 시뮬레이션 (P50 / P95 추정)**
  - P50 Latency, P95 Latency를 ms 단위로 계산 및 표시
  - 단순 “ms 표시”가 아니라, 병목 요소가 반영된 모델로 계산

- **Educational Explain (실행 계획 요약 카드)**
  - Access Path (Full Table Scan / Index Range Scan)
  - Estimated Rows (예상 스캔 rows)
  - Bottleneck (가장 큰 병목 요인 자동 진단)

- **Breakdown 시각화(비용 구성)**
  - Scan / Join / Sort / Network / Queue 로 비용을 분해
  - 스택 바(라이브러리 없이 구현)로 “어디서 시간이 쓰이는지” 직관적으로 확인

- **환경 설정(학습용 현실 변수)**
  - Table Rows(10K / 100K / 1M)
  - Selectivity(0.1% / 1% / 10% / 50%)
  - Network Latency(2ms / 20ms / 80ms)
  - QPS(1~1000) 슬라이더로 조절
  - 트래픽이 높아질수록 큐잉이 증가하여 P95가 급격히 커지는 현상을 반영

- **튜닝 레버(핵심 학습 포인트)**
  - WHERE 인덱스 ON/OFF
  - JOIN 인덱스 ON/OFF
  - 커버링 인덱스(정렬) ON/OFF
  - 결과 캐싱 적용 ON/OFF
  - 토글 변경 시 즉시 성능/병목/Breakdown이 갱신

- **Query Comparison Board (쿼리 비교 보드)**
  - 현재 쿼리를 저장해 목록으로 비교
  - Scan Type / Rows / P50 / P95 비교
  - 직전 저장 쿼리 대비 “개선/악화(ms)” 자동 표시
  - 저장 쿼리 삭제 가능

- **학습 미션(가이드형 시나리오)**
  - 01. Full Scan 탈출하기
  - 02. JOIN 지옥 해결
  - 03. 캐시의 위력
  - 버튼 하나로 환경/토글/빌더 설정을 세팅해 실험을 시작할 수 있도록 구성

---

### 구현/기술 포인트
- **“정확한 벤치마크”가 아니라 “학습용 모델”**
  - 대신 다음을 반영한 단순 모델로 결과를 구성:
    - 인덱스 유무에 따른 스캔 rows 변화(Full Scan vs Index Scan)
    - JOIN 인덱스 유무에 따른 비용 폭증(NL Join 가중)
    - ORDER BY + LIMIT 시 정렬 비용 완화(Top-N)
    - QPS 증가 시 큐잉 증가 → P95 꼬리 지연 급증 모델링
- **학습 관점의 투명성**
  - Explain 카드와 Breakdown을 통해 “왜 느린지”를 함께 설명

---

### 향후 개선 아이디어 (백로그)
- JOIN 타입(LEFT/INNER) 선택 및 카디널리티(대략) 입력으로 모델 현실성 강화
- 캐시 히트율 슬라이더(0/50/90%)로 캐시 효과를 더 직관적으로 조절
- 저장된 쿼리의 SQL을 클릭하면 빌더 상태로 복원하는 “불러오기” 기능
- 학습 미션 확장(ORDER BY 최적화, 페이징 전략, 인덱스 설계 미션 등)