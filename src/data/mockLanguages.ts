// src/data/mockLanguages.ts

// Описываем структуру одного языка, чтобы TypeScript нам помогал
export interface ILanguage {
  id: number;
  name: string;
  family: string;
  subgroup: string;
  description: string;
  image_url: string | null; 
  video_url: string | null; // URL может отсутствовать

}

export const mockLanguages: ILanguage[] = [
  {
    id: 1,
    name: "Лезгинский",
    family: "Нахско-дагестанская",
    subgroup: "Лезгинская",
    description: "Один из официальных языков Дагестана, распространен в южной части Дагестана.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/8/80/Lezgi_people.jpg",
    video_url: "",
},
  {
    id: 2,
    name: "Древнеанглийский",
    family: "Индоевропейская",
    subgroup: "Германская",
    description: "Ранняя форма английского языка, использовавшаяся в Англии и южной Шотландии.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Beowulf.firstpage.jpeg/800px-Beowulf.firstpage.jpeg",
    video_url: "",
},
  {
    id: 3,
    name: "Язык без картинки",
    family: "Вымышленная",
    subgroup: "Тестовая",
    description: "Этот язык используется для проверки отображения картинки по-умолчанию.",
    image_url: null, // Специально оставляем пустым
    video_url: "",  
},
];
