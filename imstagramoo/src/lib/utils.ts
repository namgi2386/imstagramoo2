import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const adjectives = [
  "노력하는",
  "외로운",
  "고집스런",
  "개구쟁이",
  "용감한",
  "대담한",
  "온순한",
  "장난스런",
  "촐랑대는",
  "무사태평",
  "조심스런",
  "의젓한",
  "수줍어하는",
  "덜렁대는",
  "냉정한",
  "차분한",
  "얌전한",
  "신중한",
  "변덕스런",
  "건방진",
  "겁쟁이",
  "성급한",
  "명랑한",
  "천진난만한",
  "성실한",
];

const nouns = [
  "나인테일",
  "지라치",
  "토대부기",
  "레쿠쟈",
  "토게키스",
  "싸리용",
  "어리짱",
  "에이스번",
  "님피아",
  "오거폰",
  "미끄레곤",
  "누리레느",
  "드레디어",
  "타입널",
  "밀탱크",
  "뷰티플라이",
  "루카리오",
  "빠르모트",
  "보만다",
  "라티아스",
];

export const getRandomNickname = () => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 100);

  return `${adjective}${noun}${number}`;
};
