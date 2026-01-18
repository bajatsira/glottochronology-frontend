// src/components/LanguageCard.tsx
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type  { ILanguage } from '../data/mockLanguages'; // Импортируем нашу структуру
import defaultImage from '../assets/default-image.jpg'; // Импортируем картинку-заглушку

// Определяем, какие "пропсы" (props) принимает наш компонент
interface LanguageCardProps {
  language: ILanguage;
}

export const LanguageCard = ({ language }: LanguageCardProps) => {
  // Логика для выбора картинки: если URL есть, берем его, если нет - берем заглушку
  const imageUrl = language.image_url ? language.image_url : defaultImage;

  return (
    <Card className="h-100">
      <Card.Img 
        variant="top" 
        src={imageUrl} 
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{language.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{language.family}</Card.Subtitle>
        <Card.Text>
          {language.description.substring(0, 100)}...
        </Card.Text>
        {/* Кнопка "Подробнее" ведет на детальную страницу */}
        <Link to={`/languages/${language.id}`} className="mt-auto">
          <Button variant="primary">Подробнее</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};
