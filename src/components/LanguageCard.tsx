import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { ILanguage } from '../data/mockLanguages'; 
import defaultImage from '../assets/default-image.jpg';

interface LanguageCardProps {
  language: ILanguage;
}

export const LanguageCard = ({ language }: LanguageCardProps) => {
  const imageUrl = language.ImageURL ? language.ImageURL : defaultImage;

  return (
    <Card className="h-100">
      <Card.Img
        variant="top"
        src={imageUrl}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{language.Name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{language.Family}</Card.Subtitle>
        <Card.Text>
          {language.Description.substring(0, 100)}...
        </Card.Text>
        <Link to={`/languages/${language.ID}`} className="mt-auto">
          <Button variant="primary">Подробнее</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};