export interface ILanguage {
  ID: number;      
  Name: string;     
  Family: string;  
  Subgroup: string;   
  WritingFamily: string;
  Status: string;        
  Description: string;   
  ImageURL: string | null;     
  VideoURL: string | null;    
  Lexicon: string[];       
}

export const mockLanguages: ILanguage[] = [
  {
    ID: 1,
    Name: "Лезгинский (Mock)",
    Family: "Нахско-дагестанская",
    Subgroup: "Лезгинская",
    WritingFamily: "Кириллица",
    Status: "активен",
    Description: "Один из официальных языков Дагестана, распространен в южной части Дагестана.",
    ImageURL: "https://upload.wikimedia.org/wikipedia/commons/8/80/Lezgi_people.jpg",
    VideoURL: null, 
    Lexicon: ["зун", "вун", "ам"],
  },
  {
    ID: 2,
    Name: "Древнеанглийский (Mock)",
    Family: "Индоевропейская",
    Subgroup: "Германская",
    WritingFamily: "Латиница",
    Status: "активен",
    Description: "Ранняя форма английского языка, использовавшаяся в Англии и южной Шотландии.",
    ImageURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Beowulf.firstpage.jpeg/800px-Beowulf.firstpage.jpeg",
    VideoURL: null,
    Lexicon: ["ic", "þu", "he"],
  },
  {
    ID: 3,
    Name: "Язык без картинки (Mock)",
    Family: "Вымышленная",
    Subgroup: "Тестовая",
    WritingFamily: "Нет",
    Status: "активен",
    Description: "Этот язык используется для проверки отображения картинки по-умолчанию.",
    ImageURL: null, 
    VideoURL: null,
    Lexicon: [],
  },
];
