# 사이트 주소 : [krxt.org](https://krxt.org)

# 요약

쓰던 사이트가 뭔가 유료 상품을 추가하는 건 이해 했는데 광고 넣어서 화난 중학생이 만든 사이트 포크 ☠️🤫😂✨

# Open Marble

광고 없는 [lazygyu/roulette](https://github.com/lazygyu/roulette) (Marble Roulette) **MIT 포크**.

## 왜 합법인가 (MIT)

원본 저장소 [lazygyu/roulette](https://github.com/lazygyu/roulette)는 **MIT License**입니다. MIT는 다음을 **명시적으로 허용**합니다.

- 소스 코드를 **복제·수정·재배포**하는 것
- 상업적·비상업적 사용
- 포크 후 다른 이름으로 공개하는 것

조건은 간단합니다.

1. **원저작권 고지와 MIT 전문을 유지**할 것 → 이 저장소의 [LICENSE](./LICENSE)에 `Copyright (c) 2023 LazyGyu`와 MIT 전문을 그대로 둡니다.
2. **원작자 권리를 침해하는 행위는 하지 않음** → 원본 라이브 사이트 UI를 통째로 베끼거나, MarbleRouletteShop 유료 에디터/광고 소재를 가져오지 않습니다. GitHub에 공개된 MIT 소스만 기반으로 수정합니다.

즉, “원본 사이트를 무단 복제”하는 것이 아니라, **원작자가 MIT로 공개한 코드를 라이선스 조건에 맞게 포크·수정**한 프로젝트입니다.

원작자·상표·샵 서비스와 무관한 **비공식 포크**이며, Open Marble / KRXT.ORG는 lazygyu 또는 MarbleRouletteShop과 제휴·승인 관계가 없습니다.

## 원본 박제 (upstream 원본 보관)

손대지 않은 원본 스냅샷을 이 저장소에 **그대로 남겨 둡니다.**

| 항목 | 내용 |
|------|------|
| 원본 저장소 | https://github.com/lazygyu/roulette |
| 박제 브랜치 | `upstream-original` — 포크 직후 수정 없는 원본 트리 |
| 원격 (upstream) | `https://github.com/lazygyu/roulette.git` |
| 라이선스 | MIT — Copyright (c) 2023 LazyGyu |
| 내 저장소에 있는 원본 내용.zip | https://github.com/13ksh/open-marble/blob/open-marble/roulette-main(github-lazygyu-roulette-pull-67)%20%EB%B0%B1%EC%97%85%EB%B3%B8.zip |

원본만 보고 싶을 때:

```shell
git fetch upstream
git checkout upstream-original
```

Open Marble 작업 브랜치로 돌아올 때:

```shell
git checkout open-marble
# 또는 main
```

## 원본 대비 변경 요약

- 광고 / 샵 API / Analytics 제거
- 이름·설정 프리셋 (browser `localStorage`)
- 한국어 UI, 설정 패널 재구성
- Shuffle 제거 → 이름 입력 시 자동 배치
- 완전 정적 (백엔드 없음). 로컬 및 GitHub Pages 배포 가능

## Development

```shell
npm install
npm run dev
```

Open http://localhost:1235

## Build

```shell
npm run build
```

## License

MIT — see [LICENSE](./LICENSE).

- Original work Copyright (c) 2023 LazyGyu  
- Modifications Copyright (c) 2026 Open Marble contributors

# 약속

절떄 이 프로젝트에 광고를 넣지 않겠습니다😭😭😭😭😭😭😭😭😭😭😭

# 고양이 밈

<img width="480" height="480" alt="CatMemeGIF" src="https://github.com/user-attachments/assets/4a6097fb-20db-44ff-b15f-8939be66c0db" />

# 그리고 마지막 

MIT 라이선스 해주신 lazygyu 감사 감사 ✨✨✨
그리고 이 프로젝트는 [제 cursor](https://cursor.com/@34444) (광고 아님 내가 커서(cursor) 같은 대기업과 광고 할 수 있었으면 지금 쯤 여기가 아니라 호캉스에 있었겠지😭😭😭) 과 8시간 만에 만들었습니다. ♥️♥️♥️♥️♥️♥️♥️
