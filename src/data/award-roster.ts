// Category order and recipient rows are from default.xlsx.
// Descriptions are condensed and joint awards share a row.
export type Recipient = {
  readonly names: readonly string[];
  readonly team: string;
  readonly rank: string;
};
export type FestivalCategory = {
  readonly name: string;
  readonly description: string;
  readonly recipients: readonly Recipient[];
};
export type FestivalInstitute = {
  readonly name: string;
  readonly categories: readonly FestivalCategory[];
};
type InstituteCode = "CW" | "MS";

export const festivalAwards: Readonly<
  Record<InstituteCode, FestivalInstitute>
> = {
  CW: {
    name: "CW생산본부",
    categories: [
      {
        name: "논문",
        description:
          "기술 문제를 연구·분석하고 논문으로 정리해 기술 지식을 쌓은 성과",
        recipients: [
          {
            names: ["김기웅"],
            team: "융복합기술팀",
            rank: "대상",
          },
          {
            names: ["이제석"],
            team: "기계기술2팀",
            rank: "최우수",
          },
          {
            names: ["김덕연"],
            team: "융복합기술팀",
            rank: "최우수",
          },
          {
            names: ["차도엽"],
            team: "레이다기술1팀",
            rank: "우수",
          },
          {
            names: ["박민우"],
            team: "기계기술1팀",
            rank: "우수",
          },
          {
            names: ["김기진"],
            team: "기계기술2팀",
            rank: "우수",
          },
        ],
      },
      {
        name: "특허",
        description:
          "새로운 기술 아이디어를 특허로 보호하고 회사의 지식재산을 확보한 성과",
        recipients: [
          {
            names: ["정준수"],
            team: "레이다기술2팀",
            rank: "최우수",
          },
          {
            names: ["강유하"],
            team: "기계기술1팀",
            rank: "우수",
          },
          {
            names: ["진성은"],
            team: "기계기술1팀",
            rank: "우수",
          },
        ],
      },
      {
        name: "BP(개발설계)",
        description:
          "개발·설계 과정의 기술 문제를 해결해 제품의 품질·성능·운영성을 높인 성과",
        recipients: [
          {
            names: ["유우성"],
            team: "생산2실.생산3팀",
            rank: "대상",
          },
          {
            names: ["김상열"],
            team: "레이다기술1팀",
            rank: "최우수",
          },
          {
            names: ["이광진", "정운빈"],
            team: "융복합기술팀",
            rank: "최우수",
          },
          {
            names: ["백순철"],
            team: "해양기술팀",
            rank: "최우수",
          },
          {
            names: ["김예빛"],
            team: "지휘통제기술팀",
            rank: "우수",
          },
          {
            names: ["김도영"],
            team: "기계기술1팀",
            rank: "우수",
          },
          {
            names: ["이연호"],
            team: "통신기술팀",
            rank: "우수",
          },
          {
            names: ["김동혁"],
            team: "전자기전기술팀",
            rank: "우수",
          },
          {
            names: ["이혁재"],
            team: "레이다기술2팀",
            rank: "우수",
          },
        ],
      },
      {
        name: "BP(전문기술)",
        description:
          "전문 지식과 현장 노하우로 기술 과제를 해결하고 기술 기반을 강화한 성과",
        recipients: [
          {
            names: ["허재성"],
            team: "MRO연구개발단.2팀",
            rank: "대상",
          },
          {
            names: ["배진성"],
            team: "기술기획팀",
            rank: "최우수",
          },
        ],
      },
      {
        name: "BP(혁신과제)",
        description:
          "반복 업무 자동화와 절차 개선으로 효율과 생산성을 높인 과제",
        recipients: [
          {
            names: ["최조현"],
            team: "레이다기술1팀",
            rank: "대상",
          },
          {
            names: ["진성은"],
            team: "기계기술1팀",
            rank: "최우수",
          },
          {
            names: ["이현석"],
            team: "융복합기술팀",
            rank: "최우수",
          },
          {
            names: ["김민수"],
            team: "레이다기술2팀",
            rank: "우수",
          },
          {
            names: ["이준희"],
            team: "전자기전기술팀",
            rank: "우수",
          },
          {
            names: ["김정민"],
            team: "기계기술2팀",
            rank: "우수",
          },
        ],
      },
      {
        name: "7S 낭비제거활동",
        description:
          "현장의 일곱 가지 낭비를 줄이고 시간·비용 개선 효과를 입증한 성과",
        recipients: [
          {
            names: ["김태호"],
            team: "기계기술2팀",
            rank: "대상",
          },
          {
            names: ["강신재"],
            team: "지휘통제기술팀",
            rank: "최우수",
          },
          {
            names: ["제갈성광"],
            team: "생산2실.생산3팀",
            rank: "최우수",
          },
          {
            names: ["서동민"],
            team: "기계기술2팀",
            rank: "최우수",
          },
          {
            names: ["박승빈"],
            team: "공정최적화팀",
            rank: "우수",
          },
          {
            names: ["이장호"],
            team: "생산2실.생산1팀",
            rank: "우수",
          },
          {
            names: ["이현호"],
            team: "생산2실.생산2팀",
            rank: "혁신 제안 우수인",
          },
          { names: [], team: "생산1실.생산3팀", rank: "지속실천 우수팀" },
          { names: [], team: "기계기술1팀", rank: "최다 제출팀" },
          { names: [], team: "기계기술1팀", rank: "다각화 제안 우수팀" },
        ],
      },
      {
        name: "멘토멘티 협동과제",
        description:
          "멘토의 노하우를 실무에 적용하고 공동 과제를 해결해 직무 역량을 높인 성과",
        recipients: [
          {
            names: ["멘토:홍동근 /멘티:김효근"],
            team: "지휘통제기술팀",
            rank: "최우수",
          },
          {
            names: ["멘토:홍성일 /멘티: 이동훈", "이준영"],
            team: "레이다기술2팀",
            rank: "우수",
          },
          {
            names: ["멘토: 박건우", "김기웅", "김덕연 /멘티: 홍승표"],
            team: "융복합기술팀",
            rank: "우수",
          },
        ],
      },
      {
        name: "실시제안 마일리지",
        description:
          "업무 개선 아이디어를 발굴하고 현장에서 실제 변화로 이어 간 노력",
        recipients: [
          {
            names: ["임성종"],
            team: "생산1실.생산1팀",
            rank: "",
          },
          {
            names: ["임규탁"],
            team: "생산1실.생산2팀",
            rank: "",
          },
          {
            names: ["최재은"],
            team: "생산1실.생산2팀",
            rank: "",
          },
          {
            names: ["김인선"],
            team: "생산1실.생산3팀",
            rank: "",
          },
          {
            names: ["이윤정"],
            team: "생산1실.생산3팀",
            rank: "",
          },
          {
            names: ["강나리"],
            team: "생산1실.생산3팀",
            rank: "",
          },
          {
            names: ["이상갑"],
            team: "생산1실.생산6팀",
            rank: "",
          },
          {
            names: ["박선준"],
            team: "생산1실.생산6팀",
            rank: "",
          },
          {
            names: ["심미정"],
            team: "생산2실.생산2팀",
            rank: "",
          },
          {
            names: ["서성순"],
            team: "생산2실.생산5팀",
            rank: "",
          },
        ],
      },
    ],
  },
  MS: {
    name: "미사일시스템생산본부",
    categories: [
      {
        name: "논문",
        description:
          "기술 문제를 연구·분석하고 논문으로 정리해 기술 지식을 쌓은 성과",
        recipients: [
          {
            names: ["곽태산", "박성열", "송의정"],
            team: "기계기술팀",
            rank: "대상",
          },
          {
            names: ["임경욱"],
            team: "1팀",
            rank: "최우수",
          },
          {
            names: ["김하림"],
            team: "3팀",
            rank: "최우수",
          },
        ],
      },
      {
        name: "특허",
        description:
          "새로운 기술 아이디어를 특허로 보호하고 회사의 지식재산을 확보한 성과",
        recipients: [
          {
            names: ["김달중"],
            team: "기계기술팀",
            rank: "최우수",
          },
          {
            names: ["문건우"],
            team: "기계기술팀",
            rank: "우수",
          },
          {
            names: ["송현석"],
            team: "5팀",
            rank: "우수",
          },
        ],
      },
      {
        name: "BP(개발설계)",
        description:
          "개발·설계 과정의 기술 문제를 해결해 제품의 품질·성능·운영성을 높인 성과",
        recipients: [
          {
            names: ["윤준희", "김창일"],
            team: "3팀",
            rank: "대상",
          },
          {
            names: ["신지훈"],
            team: "융합기술팀",
            rank: "최우수",
          },
          {
            names: ["허영훈"],
            team: "1팀",
            rank: "최우수",
          },
          {
            names: ["정경훈", "이성진"],
            team: "3팀",
            rank: "우수",
          },
          {
            names: ["성홍운"],
            team: "3팀",
            rank: "우수",
          },
          {
            names: ["박나영"],
            team: "융합기술팀",
            rank: "우수",
          },
          {
            names: ["김동환"],
            team: "1팀",
            rank: "우수",
          },
          {
            names: ["송원효"],
            team: "융합기술팀",
            rank: "우수",
          },
        ],
      },
      {
        name: "BP(제조전문)",
        description:
          "분야별 전문성과 노하우로 기술 과제를 해결하고 기술 기반을 강화한 성과",
        recipients: [
          {
            names: ["김성훈"],
            team: "생산2실.3팀",
            rank: "대상",
          },
          {
            names: ["김진미", "이수환"],
            team: "기술기획팀",
            rank: "최우수",
          },
          {
            names: ["한정원"],
            team: "MRO연구개발단.1팀",
            rank: "우수",
          },
          {
            names: ["이중엽"],
            team: "MRO연구개발단.1팀",
            rank: "우수",
          },
          {
            names: ["손진우"],
            team: "생산1실.3팀",
            rank: "우수",
          },
          {
            names: ["김태욱"],
            team: "생산2실.1팀",
            rank: "우수",
          },
        ],
      },
      {
        name: "BP(혁신과제)",
        description:
          "업무 효율과 생산성을 높이고 비용을 줄이는 개선 과제를 발굴·추진한 활동",
        recipients: [
          {
            names: ["송원효"],
            team: "융합기술팀",
            rank: "대상",
          },
          {
            names: ["안철완"],
            team: "5팀",
            rank: "최우수",
          },
          {
            names: ["하경준"],
            team: "생산2실.3팀",
            rank: "우수",
          },
          {
            names: ["박상호"],
            team: "생산2실.2팀",
            rank: "장려",
          },
        ],
      },
      {
        name: "부품국산화",
        description:
          "수입·외국 기술 의존 부품을 국산화해 공급망 안정에 기여한 과제",
        recipients: [
          {
            names: ["허영훈"],
            team: "1팀",
            rank: "최우수",
          },
          {
            names: ["배현진"],
            team: "1팀",
            rank: "최우수",
          },
          {
            names: ["김준기"],
            team: "3팀",
            rank: "최우수",
          },
        ],
      },
      {
        name: "산학과제",
        description:
          "대학과 함께 연구개발해 필요한 기술을 확보하고 현장 문제를 해결한 성과",
        recipients: [
          {
            names: ["정현채"],
            team: "1팀",
            rank: "최우수",
          },
          {
            names: ["성홍운"],
            team: "3팀",
            rank: "최우수",
          },
          {
            names: ["정진호"],
            team: "기계기술팀",
            rank: "최우수",
          },
        ],
      },
      {
        name: "실시제안 마일리지",
        description:
          "업무 개선 아이디어를 발굴하고 현장에서 실제 변화로 이어 간 노력",
        recipients: [
          {
            names: ["정재혁"],
            team: "생산1실.1팀",
            rank: "",
          },
          {
            names: ["정현근"],
            team: "생산1실.5팀",
            rank: "",
          },
          {
            names: ["김병후"],
            team: "생산2실.2팀",
            rank: "",
          },
          {
            names: ["고정우"],
            team: "생산2실.3팀",
            rank: "",
          },
          {
            names: ["이동규"],
            team: "생산2실.3팀",
            rank: "",
          },
          {
            names: ["김민교"],
            team: "생산2실.3팀",
            rank: "",
          },
          {
            names: ["김영서"],
            team: "생산2실.3팀",
            rank: "",
          },
          {
            names: ["임형우"],
            team: "생산2실.3팀",
            rank: "",
          },
        ],
      },
    ],
  },
};
