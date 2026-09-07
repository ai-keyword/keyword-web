# AGENTS.md

## 프로젝트 개요

"#키워드" — 해시태그(키워드)로 검색해서 관련 AI 프롬프트를 모아 보여주는 프롬프트 갤러리 서비스.
사용자는 키워드를 검색하거나 추천 키워드를 눌러서, 해당 키워드로 만들 수 있는 **이미지 프롬프트**와 **글씨(텍스트/코드) 프롬프트**를 트렌드 순위(#1~#N) 형태로 확인할 수 있다.

핵심 화면 구성:

- 상단: 서비스 타이틀(`#키워드`) + 검색창(`#키워드를 검색`) + 추천 키워드 리스트
- "요즘 뜨는 이미지 프롬프트" 섹션: 이미지 썸네일 + 순위 뱃지(#1, #2 ...) + 프롬프트 문구 + 작성자
- "요즘 뜨는 글씨 프롬프트" 섹션: 텍스트/코드형 프롬프트 카드 (설명, 단계별 안내 포함 가능) + 순위 + 작성자
- 카드는 가로 스크롤 또는 그리드로 나열, 각 카드는 클릭 시 상세/복사 가능해야 함

## 기술 스택

- 프론트엔드: Next.js (App Router) + TypeScript + Tailwind CSS
- 백엔드: FastAPI (Python)
- DB: 개발 초기 SQLite → 운영 전환 시 PostgreSQL
- ORM/마이그레이션: SQLAlchemy 2.x + Alembic
- 상태관리(프론트): 기본은 React 내장 상태(useState/useContext), 전역 상태 필요해지면 Zustand 고려

> 프론트와 백엔드는 별도 저장소 또는 모노레포의 `/frontend`, `/backend` 폴더로 분리 운영.

## 폴더 구조

### 프론트엔드 (`/frontend`)

```
/app
  /page.tsx                → 메인 검색/트렌드 페이지
  /keyword/[slug]/page.tsx → 특정 키워드 상세 페이지
/components
  SearchBar.tsx
  KeywordChip.tsx
  PromptCard.tsx           → 이미지 프롬프트 카드
  TextPromptCard.tsx       → 글씨 프롬프트 카드 (설명 + 단계 포함)
  RankBadge.tsx
  Section.tsx              → "# 요즘 뜨는 ~" 섹션 래퍼
/lib
  api.ts                    → 백엔드(FastAPI) 호출 클라이언트
  types.ts
```

### 백엔드 (`/backend`)

```
/app
  main.py                  → FastAPI 앱 엔트리포인트, 라우터 등록, CORS 설정
  /core
    config.py              → 환경변수, 설정값 (Pydantic Settings)
    database.py            → DB 세션/엔진 설정
  /models
    prompt.py              → SQLAlchemy 모델 (Prompt 테이블)
    keyword.py             → 키워드 테이블 (필요 시)
  /schemas
    prompt.py              → Pydantic 스키마 (요청/응답 DTO)
  /routers
    prompts.py             → /prompts 관련 엔드포인트
    keywords.py            → /keywords 관련 엔드포인트 (추천 키워드, 검색)
  /services
    prompt_service.py      → 검색/랭킹 계산 등 비즈니스 로직
  /repositories
    prompt_repository.py   → DB 쿼리 로직 (CRUD)
  /tests
    test_prompts.py
alembic/                    → DB 마이그레이션
requirements.txt
.env
data/
  prompts.mock.json         → 초기 시드용 목업 데이터
```

## 데이터 모델

DB 테이블(`Prompt`)과 프론트 타입은 동일한 스키마를 공유한다.

```python
# backend/app/models/prompt.py (SQLAlchemy)
class Prompt(Base):
    id: str
    type: Literal["image", "text"]
    keyword: str            # 예: "지브리"
    rank: int                # 트렌드 순위
    content: str             # "(#키워드)를 지브리 스타일로 바꿔줘~"
    description: str | None  # 텍스트형 프롬프트 부가 설명
    thumbnail_url: str | None
    author: str
    created_at: datetime
```

```ts
// frontend/lib/types.ts
type Prompt = {
    id: string;
    type: "image" | "text";
    keyword: string;
    rank: number;
    content: string;
    description?: string;
    thumbnailUrl?: string;
    author: string;
    createdAt: string;
};
```

- 프롬프트 문구 안의 `#키워드`는 사용자가 검색한 키워드로 치환되어 보여지는 플레이스홀더. 프론트에서 `fillKeyword(content, keyword)` 유틸로 치환.

## API 엔드포인트

```
GET  /api/keywords/trending                          → 추천 키워드 목록
GET  /api/prompts?keyword=지브리&type=image&sort=rank → 키워드/타입별 프롬프트 목록 (트렌드 섹션용)
GET  /api/prompts/{id}                                → 프롬프트 상세
POST /api/prompts                                     → 프롬프트 등록 (로그인 사용자)
```

## 프론트 ↔ 백엔드 연결

- 로컬 개발: 프론트는 `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`으로 FastAPI 직접 호출
- FastAPI `CORSMiddleware`에 `http://localhost:3000`(Next dev 서버) 허용 추가
- 배포: 프론트(Vercel 등)와 백엔드(Railway/Render 등)를 분리 배포, 또는 Next.js `rewrites`로 `/api/*`를 FastAPI로 프록시

## 코딩 컨벤션

**프론트**

- 컴포넌트는 함수형 + TypeScript, named export 기본
- 클라이언트 인터랙션(검색 입력, 카드 클릭 등)이 있는 컴포넌트에만 `"use client"` 지정
- Tailwind 유틸리티 클래스 사용, 커스텀 CSS는 최소화
- 순위 뱃지(#1, #2...)는 공통 `RankBadge` 컴포넌트로 통일

**백엔드**

- 계층 분리 유지: `routers`(요청/응답) → `services`(비즈니스 로직: 랭킹 정렬, 키워드 치환 등) → `repositories`(DB 접근)
- 모든 요청/응답은 Pydantic 스키마로 타입 명시, `models`(DB) ↔ `schemas`(API)는 분리해서 섞지 말 것
- DB 스키마 변경 시 반드시 Alembic 마이그레이션 생성

## 실행 명령

```
# 프론트
cd frontend
npm install
npm run dev      # 로컬 개발 서버
npm run build
npm run lint

# 백엔드
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload   # 로컬 개발 서버 (기본 8000 포트)
alembic upgrade head             # DB 마이그레이션 적용
pytest                           # 테스트 실행
```

## 에이전트 작업 시 유의사항

- 프론트/백엔드 폴더 구조를 따르고, 임의로 새 최상위 폴더를 만들지 말 것
- `Prompt` 스키마를 변경할 경우 `backend/app/models`, `backend/app/schemas`, `frontend/lib/types.ts` 세 곳을 함께 갱신하고 Alembic 마이그레이션도 생성할 것
- UI 문구(예: "요즘 뜨는 이미지 프롬프트")는 하드코딩된 한국어 문자열이며, 임의로 영어로 바꾸지 말 것
- 이미지형/텍스트형 프롬프트 카드는 레이아웃이 다르므로 컴포넌트를 분리 유지 (`PromptCard` vs `TextPromptCard`)
- 커밋 전 프론트는 `npm run lint`/`npm run build`, 백엔드는 `pytest`가 통과하는지 확인
