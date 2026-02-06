// mockLanguages.ts

// ИЗМЕНЕНИЕ №1: Все поля интерфейса теперь с маленькой буквы
export interface ILanguage {
  id: number;
  name: string;
  family: string;
  subgroup: string;
  writingFamily: string;
  status: string;
  description: string;
  imageURL: string | null;
  videoURL: string | null;
  lexicon: string[];
}

// ИЗМЕНЕНИЕ №2: Все поля в моковых данных тоже с маленькой буквы
export const mockLanguages: ILanguage[] = [
  {
    id: 1,
    name: "Лезгинский (Mock)",
    family: "Нахско-дагестанская",
    subgroup: "Лезгинская",
    writingFamily: "Кириллица",
    status: "активен",
    description: "Один из официальных языков Дагестана, распространен в южной части Дагестана.",
    imageURL: "https://upload.wikimedia.org/wikipedia/commons/8/80/Lezgi_people.jpg",
    videoURL: null,
    lexicon: ["зун", "вун", "ам"],
  },
  {
    id: 2,
    name: "Древнеанглийский (Mock)",
    family: "Индоевропейская",
    subgroup: "Германская",
    writingFamily: "Латиница",
    status: "активен",
    description: "Ранняя форма английского языка, использовавшаяся в Англии и южной Шотландии.",
    imageURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Beowulf.firstpage.jpeg/800px-Beowulf.firstpage.jpeg",
    videoURL: null,
    lexicon: ["ic", "þu", "he"],
  },
  {
    id: 3,
    name: "Язык без картинки (Mock)",
    family: "Вымышленная",
    subgroup: "Тестовая",
    writingFamily: "Нет",
    status: "активен",
    description: "Этот язык используется для проверки отображения картинки по-умолчанию.",
    imageURL: null,
    videoURL: null,
    lexicon: [],
  },
];
