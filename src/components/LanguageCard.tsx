import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { ILanguage } from '../data/mockLanguages'; 
import defaultImage from '../assets/default-image.jpg';

interface LanguageCardProps {
  language: ILanguage;
}

export const LanguageCard = ({ language }: LanguageCardProps) => {
  const imageUrl = language.imageURL ? language.imageURL : defaultImage;

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
        <Link to={`/languages/${language.id}`} className="mt-auto">
          <Button variant="primary">Подробнее</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};