# gemini-canvas-mission

Gemini Canvas 미션 결과물을 관리하는 저장소입니다.

## 목적

- Gemini Canvas로 제작한 웹앱 결과물을 기록하고 공유합니다.
- 앱별 요구사항, 배포 링크, 회고를 일관된 형식으로 남깁니다.

# 구현 웹앱

## 1. 👗 AI My Closet (Smart Outfit Planner)
사용자의 실제 옷장 데이터를 기반으로 날씨와 상황에 맞는 최적의 코디를 제안하는 AI 패션 컨설턴트 웹 앱입니다.

🌟 Key Features (주요 기능)
Real-time Closet Management: Firebase Firestore를 연동하여 아우터, 상의 등 자신의 옷을 실시간으로 추가하고 관리(CRUD)할 수 있습니다.

Location-based Weather Analysis: 사용자가 선택한 날짜와 지역의 날씨 정보를 AI가 분석하여 적절한 의상을 추천합니다.

AI Styling Report: Gemini 2.5 Flash 모델을 사용하여 단순히 옷을 골라주는 것을 넘어, 왜 이 옷이 오늘 날씨에 적합한지 상세한 리포트를 생성합니다.

Modern Responsive UI: Tailwind CSS를 활용해 모바일과 데스크탑 모두에서 쾌적하게 사용할 수 있는 Clean & Professional 인터페이스를 구현했습니다.

## 2. ❌ My-Tic-Tac-Toe: Advanced Bomb Edition
단순한 룰을 넘어 **전략적 변수(폭탄, 뺏기)**를 추가하여 게임성을 극대화한 5x5 데이터 구조 기반의 보드게임입니다.

🌟 Key Features (주요 기능)
5x5 Grid & 4-in-a-row: 기존 3x3 방식에서 확장된 5x5 그리드를 채택하고, 4개의 표식을 먼저 연결하면 승리하는 고도화된 규칙을 적용했습니다.

Bomb Traps (폭탄 시스템): 게임 시작 전 2~5개의 랜덤 폭탄을 설정할 수 있으며, 해당 칸 선택 시 턴을 소비하게 만드는 리스크 관리 요소를 도입했습니다.

Overwriting Strategy (뺏기 시스템): 3턴 이후부터 상대방의 칸을 내 것으로 바꿀 수 있는 기회(인당 3회)를 부여하여 전략적 역전이 가능하도록 설계했습니다.

Sudden Death Mode: 보드가 모두 가득 찰 경우 '무제한 뺏기' 모드가 활성화되어 게임이 무승부 없이 끝까지 박진감 있게 진행됩니다.

## 3. 🧠 Kotlin Syntax Master Quiz
코틀린의 기초 문법부터 OOP, 심화 기능까지 단계별로 정복할 수 있는 대화형 문법 학습 플랫폼입니다.

🌟 Key Features (주요 기능)
Tiered Learning System: 초급(기본 타입), 중급(제어문/함수), 고급(OOP/코루틴)으로 세분화된 난이도를 제공하여 사용자 수준에 맞는 맞춤형 학습이 가능합니다.

Dual Quiz Formats: 객관식(Choice)뿐만 아니라 직접 코드를 입력하는 주관식(Input) 문항을 혼합 배치하여 문법의 정확한 이해도를 측정합니다.

Dynamic Content Engine: 대규모 문제 은행(All Questions) 데이터를 기반으로 문제를 무작위로 추출(Shuffle)하여 매번 새로운 퀴즈 환경을 제공합니다.

Smart Progress Tracking: 실시간 프로그레스 바와 중간 채점 기능을 통해 현재 학습 성취도를 시각적으로 확인할 수 있습니다.

## 4. 📝 AI Markdown Template Builder
사용자가 입력한 상황(SITUATION)에 맞춰 최적의 마크다운 문서 구조를 AI가 즉석에서 설계해주는 문서 자동화 템플릿 엔진입니다.

🌟 Key Features (주요 기능)
Context-Aware Generation: Gemini 2.5 Flash API를 활용하여 단순한 텍스트 생성을 넘어, 사용자가 바로 내용을 채워 넣을 수 있는 구조적인 가이드라인([이곳에 입력하세요] 등)을 포함한 템플릿을 생성합니다.

Custom Markdown Parser: 라이브러리 의존성을 최소화한 자체 마크다운 파서를 통해 생성된 템플릿을 브라우저에 즉시 시각화하여 렌더링합니다.

Minimalist UI/UX: Tailwind CSS와 Glassmorphism 디자인을 적용하여 복잡한 기능 없이 핵심인 '입력과 결과'에 집중할 수 있는 쾌적한 환경을 제공합니다.

Retry & Error Handling: API 호출 시 지수 백오프(Exponential Backoff) 기반의 재시도 로직을 구현하여 네트워크 불안정 상황에서도 안정적으로 동작합니다.
